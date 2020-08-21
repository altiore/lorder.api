import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ValidationError } from 'class-validator';
import * as moment from 'moment';
import { DeleteResult, EntityManager, IsNull } from 'typeorm';

import { Project } from '@orm/project';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';

import { PaginationDto } from '@common/dto';

import { DATE_FORMAT } from '../@common/consts';
import { ValidationException } from '../@common/exceptions/validation.exception';
import { TaskFlowStrategy, TASK_FLOW_STRATEGY } from '../@domains/strategy';
import { Task } from '../@orm/task';
import { TaskType } from '../@orm/task-type/task-type.entity';
import { UserTask } from '../@orm/user-task';
import { UserWork, UserWorkRepository } from '../@orm/user-work';
import { ProjectService } from '../project/project.service';
import { ProjectTaskService } from '../project/task/project.task.service';
import { TaskCommentService } from '../task-comment/task-comment.service';
import { TaskService } from '../task/task.service';
import { UserService } from '../user/user.service';
import {
  RevertBackDto,
  StartResponse,
  StopResponse,
  UserWorkCreateDto,
  UserWorkEditResultDto,
  UserWorkPatchDto,
  UserWorkStartDto,
} from './dto';

@Injectable()
export class UserWorkService {
  constructor(
    @InjectRepository(UserWorkRepository) private readonly userWorkRepo: UserWorkRepository,
    private readonly projectService: ProjectService,
    private readonly projectTaskService: ProjectTaskService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly taskCommentService: TaskCommentService
  ) {}

  public findAll(pagesDto: PaginationDto, user: User): Promise<UserWork[]> {
    return this.userWorkRepo.findAllWithPagination(pagesDto, user);
  }

  public async findOneByUser(userWorkId: number, user: User): Promise<UserWork> {
    const userWork = await this.userWorkRepo.findOneByUser(userWorkId, user);
    if (!userWork) {
      throw new ForbiddenException('Вы можете менять время только своей работы');
    }
    return userWork;
  }

  public async findOneByUserAndCheckAccess(
    userWorkId: number,
    user: User,
    accessLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED
  ): Promise<UserWork> {
    const userWork = await this.userWorkRepo.findOneByUser(userWorkId, user);
    if (!userWork) {
      throw new ForbiddenException('Вы пытаетесь изменить чужую работу');
    }
    const project = await this.projectService.findOneByMember(userWork.projectId, user);
    if (!project || !project.isAccess(accessLevel)) {
      throw new ForbiddenException('У вас нет доступа к проекту, к которому принадлежит эта задача');
    }
    userWork.task.project = project;
    return userWork;
  }

  public async updateTime(
    userWork: UserWork,
    user: User,
    recalculate: boolean = false,
    manager?: EntityManager
  ): Promise<UserWork> {
    // 1. Проверить, что обнровляемое время валидно
    if (userWork.finishAt && moment(userWork.startAt).diff(moment(userWork.finishAt)) > 0) {
      throw new NotAcceptableException('startAt не может быть позже, чем finishAt');
    }

    // 2. Убедиться, что все необходимые для проверок данные загружены
    const curManager = manager || this.userWorkRepo.manager;
    if (!userWork.projectId || !userWork.task.userTasks) {
      userWork.task = await curManager.findOne(Task, {
        relations: ['performer', 'userTasks', 'project'],
        where: { id: userWork.taskId },
      });
    }

    // 3. Сохранить новое время в задаче
    const resultUserWork = await curManager.save(UserWork, userWork);

    // 4. Обновить user_tasks и user_project
    await this.projectService.updateStatisticForUserWork(user, curManager, userWork);
    // TODO: update existing instead of getting one more time
    resultUserWork.task.userTasks = await curManager.find(UserTask, { taskId: userWork.taskId });

    return resultUserWork;
  }

  public async remove(userWork: UserWork, user): Promise<DeleteResult | undefined> {
    let result: DeleteResult;
    await this.userWorkRepo.manager.transaction(async (entityManager) => {
      result = await entityManager.delete(UserWork, { id: userWork.id });
      await this.projectService.updateStatisticForUserWork(user, entityManager, userWork);
    });
    return result;
  }

  private async finishUserWork(
    curManager: EntityManager,
    userWork: UserWork,
    user: User,
    pushForward?: boolean
  ): Promise<UserWork> {
    // 1. Если нет projectId, найти его!
    if (!userWork.projectId || !userWork.task.userTasks) {
      userWork.task = await curManager.findOne(Task, {
        relations: ['performer', 'userTasks', 'project'],
        where: { id: userWork.taskId },
      });
    }

    // 2. Обновить finishAt - это и есть завершение задачи. Завершение работы
    userWork.finishAt = moment();
    const resUserWork = await this.updateTime(userWork, user, false, curManager);

    // 3. Завершить задачу
    userWork.task = await this.finishTask(userWork.task, user, pushForward, curManager);

    return resUserWork;
  }

  private async finishTask(task: Task, user: User, pushForward: boolean, manager): Promise<Task> {
    // 1. Подготовить данные, общие для всех стратегий
    const newTaskData: Partial<Task> = { inProgress: false };

    // 2. Если задачу нунжно перемещать вперед, то добавить данные для обновления
    if (pushForward) {
      // 2.1.
      const strategy = await this.projectService.getCurrentUserStrategy(task.project, user, manager);
      const objectForValidation = this.projectService.getTaskDataForStrategyValidation(task, user);
      const [moveTo, errors] = strategy.pushForward(task.statusTypeName, objectForValidation);
      if (!moveTo) {
        throw new NotAcceptableException(
          `Невозможно изменить статус задачи "${task.statusTypeName}". Видимо, у вас нет на это прав`
        );
      }

      if (errors.length) {
        throw new ValidationException(errors.map((res) => Object.assign(new ValidationError(), res)));
      }

      if (strategy.strategy === TASK_FLOW_STRATEGY.ADVANCED) {
        const step = strategy.findStepByStatusName(moveTo.to);
        // если на следующем шаге нет возможности начать задачу для моего пользователя,
        // то сменить пользователя
        if (step && !strategy.canBeStarted(step.status)) {
          task.performerId = await this.projectService.findStatusPerformerByStep(task.project, strategy, step, manager);
          newTaskData.performerId = task.performerId;
        }
      }

      task.statusTypeName = moveTo.to;
      newTaskData.statusTypeName = moveTo.to;
    }

    return await this.taskService.updateByUser(task, newTaskData, user, manager);
  }

  public async finishNotFinished(user: User, manager?: EntityManager): Promise<UserWork[]> {
    const curManager = manager || this.userWorkRepo.manager;
    const userWorks = await curManager.find(UserWork, {
      relations: ['task', 'task.userTasks', 'task.project'],
      where: { finishAt: IsNull(), user },
    });

    return await Promise.all(
      userWorks.map(async (userWork) => {
        return await this.finishUserWork(curManager, userWork, user, true);
      })
    );
  }

  private async startTransactionContent(
    project: Project,
    user: User,
    userWorkData: UserWorkStartDto,
    entityManager: EntityManager
  ) {
    const result: StartResponse = {
      finished: [],
      started: null,
    };

    // 0. Находим стратегию перемещения задач
    const strategy = await this.projectService.getCurrentUserStrategy(project, user, entityManager);

    // 1. Найти задачу для старта
    const task = await this.findTaskByStartDto(project, user, userWorkData, entityManager);

    // 2. Проверить, что эту задачу может начать текущий пользователь
    await this.checkUserCanStart(strategy, task, user);

    // 3. Завершить предыдущие задачи, если есть незавершенные
    result.finished = await this.finishNotFinished(user, entityManager);

    // 4. Создать новую запись в таблице "работа пользователя" и обновить информацию о задаче
    let startAt;
    if (result.finished && result.finished.length) {
      startAt = result.finished[0].finishAt;
    }
    const preparedUserWorkData: UserWorkCreateDto = {
      description: userWorkData.description,
      projectId: task.projectId,
      taskId: task.id,
      title: userWorkData.description,
    };
    result.started = await this.startTask(task, user, preparedUserWorkData, startAt, strategy, entityManager);

    return result;
  }

  public async start(project: Project, user: User, userWorkData: UserWorkStartDto): Promise<StartResponse> {
    let result: StartResponse = {
      finished: [],
      started: null,
    };
    await this.userWorkRepo.manager.transaction(async (entityManager) => {
      result = await this.startTransactionContent(project, user, userWorkData, entityManager);
    });

    return result;
  }

  public async createAndStart(project: Project, user: User): Promise<StartResponse> {
    let result: StartResponse = {
      finished: [],
      started: null,
    };

    const date = moment().format(DATE_FORMAT);
    const title = `Задача ${date}`;

    await this.userWorkRepo.manager.transaction(async (entityManager) => {
      const task = await this.projectTaskService.create({ title }, project, user, entityManager);

      result = await this.startTransactionContent(
        project,
        user,
        {
          description: `Задача создана с доски пользователя ${date}`,
          projectId: project.id,
          sequenceNumber: task.sequenceNumber,
        },
        entityManager
      );
    });

    return result;
  }

  public async stop(userWork: UserWork, user: User): Promise<StopResponse> {
    if (userWork.finishAt) {
      throw new NotAcceptableException('Эта задача уже завершена. Вы не можете завершить одну и ту же задачу дважды');
    }
    const result: StopResponse = {
      next: null,
      previous: null,
    };
    await this.userWorkRepo.manager.transaction(async (entityManager) => {
      // 1. Решаем вопрос с предыдущей задачей
      result.previous = await this.finishUserWork(entityManager, userWork, user, true);

      // 2. Решаем вопрос с новой задачей
      const defProject = await this.userService.getDefaultProject(user, entityManager);
      const userWorkData = {
        description: `После "${result.previous.task.title}"`,
        projectId: defProject.id,
        title: 'Перерыв/Отдых',
      };
      const { task, strategy } = await this.createTaskByProject(defProject, user, userWorkData, entityManager);
      result.next = await this.startTask(task, user, userWorkData, result.previous.finishAt, strategy, entityManager);
    });
    return result;
  }

  private async pauseTransactionContent(
    userWork: UserWork,
    user: User,
    manager: EntityManager,
    withPrevTaskId: boolean = true
  ): Promise<StopResponse> {
    const stopResponse: StopResponse = {
      next: null,
      previous: null,
    };

    // 1. Останавливаем предыдущую задачу
    stopResponse.previous = await this.finishUserWork(manager, userWork, user);

    // 2. Создаем новую С ПРАВИЛЬНЫМ prevTaskId!
    const defProject = await this.userService.getDefaultProject(user, manager);
    const userWorkData: UserWorkCreateDto = {
      description: `После "${stopResponse.previous.task.title}"`,
      projectId: defProject.id,
      title: 'Перерыв/Отдых',
    };
    if (withPrevTaskId) {
      userWorkData.prevTaskId = userWork.taskId;
    }
    const { task, strategy } = await this.createTaskByProject(defProject, user, userWorkData, manager);
    stopResponse.next = await this.startTask(
      task,
      user,
      userWorkData,
      stopResponse.previous.finishAt,
      strategy,
      manager
    );

    // 3. Добавляем в ответ предыдущую задачу к той, что только что создали, чтоб знать, какую задачв возобновлять
    stopResponse.next.prevTask = userWork.task;
    return stopResponse;
  }

  public async pause(userWork: UserWork, user: User): Promise<StopResponse> {
    if (userWork.finishAt) {
      throw new NotAcceptableException('Эта задача уже завершена. Вы не можете завершить одну и ту же задачу дважды');
    }

    let stopResponse: StopResponse = {
      next: null,
      previous: null,
    };
    await this.userWorkRepo.manager.transaction(async (manager) => {
      stopResponse = await this.pauseTransactionContent(userWork, user, manager);
    });

    return stopResponse;
  }

  public async update(userWork: UserWork, userWorkDto: UserWorkPatchDto, user: User): Promise<UserWorkEditResultDto> {
    // 0. Обернуть выполнение в транзакцию
    let removed = [];
    let touched = [];
    if (userWorkDto.startAt || userWorkDto.finishAt) {
      // 1. найти все задачи, затрагивающие этот промежуток времени
      const touchedUserWorks = await this.userWorkRepo.findAllTouchedBetween(
        userWork,
        user,
        userWorkDto.startAt ? moment(userWorkDto.startAt) : userWork.startAt,
        userWorkDto.finishAt ? moment(userWorkDto.finishAt) : userWork.finishAt
      );

      // 2. удалить все задачи, полностью включенные в этот промежуток времени
      removed = touchedUserWorks.filter(
        (el) =>
          el.startAt.diff(userWorkDto.startAt ? moment(userWorkDto.startAt) : userWork.startAt) >= 0 &&
          (el.finishAt
            ? el.finishAt.diff(userWorkDto.finishAt ? moment(userWorkDto.finishAt) : userWork.finishAt || moment()) <= 0
            : !userWorkDto.finishAt)
      );
      if (removed.length) {
        for (const uw of removed) {
          await this.remove(uw, user);
        }
      }

      // 3. изменить все задачи, которые затрагивает этот промежуток времени
      touched = touchedUserWorks.filter((tuw: any) => removed.findIndex((el) => el.id === tuw.id) === -1);
      if (touched.length) {
        touched = touched.map((el) => {
          if (
            el.startAt &&
            userWorkDto.finishAt &&
            el.startAt.diff(moment(userWorkDto.finishAt)) < 0 &&
            el.startAt.diff(moment(userWorkDto.startAt)) >= 0
          ) {
            el.startAt = moment(userWorkDto.finishAt);
          }

          if (
            el.finishAt &&
            el.finishAt.diff(moment(userWorkDto.startAt)) > 0 &&
            (!userWorkDto.finishAt || el.finishAt.diff(moment(userWorkDto.finishAt)) <= 0)
          ) {
            el.finishAt = moment(userWorkDto.startAt);
          }

          return el;
        });
        for (const uw of touched) {
          await this.updateTime(uw, user, true);
        }
      }
    }

    // 4. изменить изменяемую задачу
    if (userWork.taskId !== userWorkDto.taskId) {
      try {
        // try to find task and check user access to this task
        userWork.task = await this.taskService.findOneById(userWorkDto.taskId, user);
      } catch (e) {
        throw new ValidationException(
          [
            Object.assign(new ValidationError(), {
              constraints: {
                isNotFound: 'Задача, соответствующая этому taskId не была найдена',
              },
              property: 'taskId',
              value: userWorkDto.taskId,
            }),
          ],
          'Задача не найдена'
        );
      }
    }
    const updateUserWork = this.userWorkRepo.merge(userWork, userWorkDto);
    const edited = await this.updateTime(updateUserWork, user, true);

    // prepare correct userTasks before returning response
    for (const rem of removed) {
      rem.task = await this.taskService.findOneByIdWithUserTasks(rem.taskId);
    }
    for (const touch of touched) {
      touch.task = await this.taskService.findOneByIdWithUserTasks(touch.taskId);
    }
    edited.task = await this.taskService.findOneByIdWithUserTasks(edited.taskId);

    return {
      edited,
      removed,
      touched,
    };
  }

  public async revertBack(
    sequenceNumber: number,
    project: Project,
    user: User,
    revertBackDto: RevertBackDto
  ): Promise<{ task: Task; stopResponse: StopResponse }> {
    let stopResponse: StopResponse = {
      next: null,
      previous: null,
    };
    let task = await this.userWorkRepo.manager.findOne(Task, {
      where: { sequenceNumber, project: { id: project.id } },
      relations: ['comments', 'userWorks'],
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена!');
    }

    await this.userWorkRepo.manager.transaction(async (manager) => {
      // 1. Определить, можем ли мы вернуть задачу назад
      if (task.performerId !== user.id) {
        throw new NotAcceptableException('Вы пытаетесь вернуть назад задачу, которая не назначена на вас');
      }

      const strategy = await this.projectService.getCurrentUserStrategy(task.project, user, manager);
      const stepForBringBack = strategy.bringBack(task.statusTypeName);
      if (!stepForBringBack) {
        throw new NotAcceptableException('Задача не может быть возвращена назад');
      }

      // 2. Если задача в прогрессе - поставить ее на паузу
      const userWork = task.userWorks.find((el) => !el.finishAt);
      if (userWork && !userWork.finishAt) {
        stopResponse = await this.pauseTransactionContent(userWork, user, manager, false);
      }

      // 3. Поменять статус задачи и ответственного
      const performerId = await this.projectService.findStatusPerformerByStep(
        task.project,
        strategy,
        stepForBringBack,
        manager
      );

      const newTaskData: Partial<Task> = {
        statusTypeName: stepForBringBack.status,
        performerId,
      };
      task = await this.taskService.updateByUser(task, newTaskData, user, manager);

      // 4. Добавить комментарий в задачу
      const comment = await this.taskCommentService.createNewComment(
        revertBackDto.reason,
        task.id,
        task.projectId,
        user,
        manager
      );
      task.commentsCount += 1;
      task.comments.push(comment);
    });

    return { task, stopResponse };
  }

  public recent(user: User, pagesDto: PaginationDto): Promise<UserWork[]> {
    return this.userWorkRepo.findWithPaginationByUser(user, pagesDto);
  }

  public async findAllByTaskSequenceNumber(
    project: Project,
    user: User,
    sequenceNumber: number,
    { skip = 0, count = 20, orderBy = 'startAt', order = 'desc' }: PaginationDto
  ): Promise<UserWork[]> {
    const checkedTask = await this.projectTaskService.checkAccess(sequenceNumber, project, user);

    return await this.userWorkRepo.find({
      order: { [orderBy]: order.toUpperCase() },
      relations: ['task'],
      skip,
      take: count,
      where: {
        taskId: checkedTask.id,
      },
    });
  }

  public async checkUserCanStart(strategy: TaskFlowStrategy, task: Task, user: User): Promise<void> {
    // 1. Проверить, что пользователь назначен на текущую задачу
    if (task.performerId !== user.id) {
      throw new NotAcceptableException('Вы не можете начать эту задачу. Она назначена на кого-то другого');
    }

    // 2. Проверить, что задачу никто не выполняет
    if (task.inProgress) {
      // TODO: проверить так же, что нет незаконченных работ в этой задаче
      throw new NotAcceptableException('Эта задача уже в процессе выполнения!');
    }

    // 3. Проверить, что задача в этом статусе доступна пользователю для выполнения
    if (!strategy.canBeStarted(task.statusTypeName)) {
      throw new NotAcceptableException('Ваша роль в проекте не позволяет вам начать задачу в этом статусе');
    }
  }

  private async findTaskByStartDto(
    project: Project,
    user: User,
    userWorkData: UserWorkStartDto,
    manager: EntityManager
  ): Promise<Task> {
    let startedTask;
    startedTask = await this.taskService.findOneBySNAndProject(
      userWorkData.sequenceNumber,
      userWorkData.projectId,
      user,
      undefined,
      undefined,
      undefined,
      manager
    );
    if (!startedTask) {
      throw new NotFoundException(
        `Указанная задача ${userWorkData.sequenceNumber} не найдена в проекте ${project.title}`
      );
    }

    return startedTask;
  }

  private async findTaskOrCreateDefault(
    project: Project,
    user: User,
    userWorkData: UserWorkCreateDto,
    strategy: TaskFlowStrategy,
    manager: EntityManager
  ): Promise<Task> {
    let startedTask;
    if (userWorkData.taskId) {
      startedTask = await this.taskService.findOneById(
        userWorkData.taskId,
        user,
        undefined,
        undefined,
        undefined,
        manager
      );
      if (!startedTask) {
        throw new NotFoundException(`Указанная задача ${userWorkData.taskId} не найдена в проекте ${project.title}`);
      }
    } else {
      const taskType = await manager.findOne(TaskType, { name: 'feature' });
      const taskData = {
        description: userWorkData.description || '',
        performerId: userWorkData.performerId || user.id,
        statusTypeName: strategy.getCreatedStatus(),
        typeId: taskType ? taskType.id : undefined,
        title: userWorkData.title,
      };
      startedTask = await this.taskService.createByProject(taskData, project, user, manager);
    }

    return startedTask;
  }

  private async createTaskByProject(
    project: Project,
    user: User,
    userWorkData: UserWorkCreateDto,
    manager: EntityManager
  ): Promise<{ task: Task; strategy }> {
    const strategy = await this.projectService.getCurrentUserStrategy(project, user, manager);
    const task = await this.findTaskOrCreateDefault(project, user, userWorkData, strategy, manager);
    return { task, strategy };
  }

  private async startTask(
    task: Task,
    user: User,
    userWorkData: UserWorkCreateDto,
    startAt: moment.Moment,
    strategy: TaskFlowStrategy,
    manager?: EntityManager
  ): Promise<UserWork> {
    const curManager = manager || this.userWorkRepo.manager;
    let startedTask: Task = task;

    if (!task.inProgress) {
      startedTask = await this.taskService.updateByUser(
        startedTask,
        { inProgress: true, statusTypeName: strategy.getInProgressStatus(task.statusTypeName) },
        user,
        curManager
      );
    }

    return await this.userWorkRepo.startTask(
      startedTask,
      user,
      {
        description: userWorkData.description,
        prevTaskId: userWorkData.prevTaskId,
      },
      startAt,
      curManager
    );
  }
}
