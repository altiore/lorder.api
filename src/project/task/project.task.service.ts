import { ForbiddenException, Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ValidationError } from 'class-validator';
import { pick } from 'lodash';
import { EntityManager } from 'typeorm';

import { Project } from '@orm/project';
import { ProjectTaskType, ProjectTaskTypeRepository } from '@orm/project-task-type';
import { Task } from '@orm/task';
import { TaskType } from '@orm/task-type/task-type.entity';
import { User } from '@orm/user';
import { ACCESS_LEVEL, UserProject } from '@orm/user-project';

import { ListResponseDto, PaginationDto } from '@common/dto';
import { ValidationException } from '@common/exceptions/validation.exception';

import { TaskService } from 'task/task.service';

import { STATUS_NAME, TaskFlowStrategy, TASK_FLOW_STRATEGY } from '../../@domains/strategy';
import { UserTask } from '../../@orm/user-task';
import { ProjectService } from '../project.service';
import { TaskCreateDto, TaskMoveDto, TaskUpdateDto } from './dto';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
    private readonly projectService: ProjectService,
    private readonly taskService: TaskService
  ) {}

  public async findAll(pagesDto: PaginationDto, project: Project, user: User): Promise<ListResponseDto<Task>> {
    return await this.taskService.findAllByProject(pagesDto, project, user);
  }

  public findOne(sequenceNumber: number, projectId: number): Promise<Task> {
    return this.taskService.findOneBySequenceNumber(sequenceNumber, projectId);
  }

  public async create(taskCreateDto: TaskCreateDto, project: Project, user: User): Promise<Task> {
    const strategy = await this.projectService.getCurrentUserStrategy(project, user, this.projectTaskTypeRepo.manager);
    const preparedData = await this.parseTaskDtoToTaskObj(taskCreateDto, project.id, strategy, true);
    return await this.taskService.createByProject(preparedData, project, user);
  }

  public async update(
    sequenceNumber: number,
    taskUpdateDto: TaskUpdateDto,
    project: Project,
    user: User
  ): Promise<Task> {
    // 1. Получить информацию о стратегии, доступной пользователю в данном проекте
    const strategy = await this.projectService.getCurrentUserStrategy(project, user, this.projectTaskTypeRepo.manager);

    // 2. Проверить соответсвие проекта задаче и уровень доступа пользователя к проекту
    const checkedTask = await this.checkAccess(sequenceNumber, project, user, ACCESS_LEVEL.YELLOW);

    // 3. Проверить, что задача может быть изменена (Законченная или заархивированная задача не может быть изменена)
    this.checkCanBeEdit(checkedTask);

    // 4. Подготовить данные для обновления задачи и обновить задачу
    const preparedData = await this.parseTaskDtoToTaskObj(taskUpdateDto, project.id, strategy);

    // 5. Подготовить value данные userTask и обновить userTask
    const [value, transitToStatus] = await this.updateUserTask(taskUpdateDto, checkedTask, user, strategy);
    if (typeof value !== 'undefined') {
      preparedData.value = value;
    }
    if (transitToStatus !== checkedTask.statusTypeName) {
      preparedData.statusTypeName = transitToStatus;
    }

    return await this.taskService.updateByUser(checkedTask, preparedData, user);
  }

  public async move(sequenceNumber: number, project: Project, user: User, taskMoveDto: TaskMoveDto): Promise<Task> {
    const manager = this.projectTaskTypeRepo.manager;

    // 1. Проверить соответсвие проекта задаче и уровень доступа пользователя к проекту
    const checkedTask = await this.checkAccess(sequenceNumber, project, user);

    // 2. TODO: проверить разрешенное перемещение задачи для данного пользователя
    const toStatus = await this.checkUserCanMove(project, user, checkedTask, taskMoveDto, manager);

    // 3. Обновить и вернуть обновленную задачу
    return this.taskService.updateByUser(checkedTask, { statusTypeName: toStatus }, user);
  }

  public async delete(sequenceNumber: number, projectId: number): Promise<Task | false> {
    const task = await this.findOne(sequenceNumber, projectId);
    if (!task) {
      return false;
    }
    await this.taskService.deleteBySequenceNumber(sequenceNumber, projectId);
    return task;
  }

  private async updateUserTask(
    taskUpdateDto: TaskUpdateDto,
    checkedTask: Task,
    user: User,
    strategy: TaskFlowStrategy
  ): Promise<[number | undefined, STATUS_NAME]> {
    if (strategy.strategy === TASK_FLOW_STRATEGY.SIMPLE) {
      return [undefined, checkedTask.statusTypeName];
    }

    const userTask = pick(taskUpdateDto, UserTask.plainFields);
    let value: number | undefined;
    if (userTask && Object.keys(userTask).length) {
      const curUserTask = await this.projectTaskTypeRepo.manager.findOne(UserTask, {
        taskId: checkedTask.id,
        userId: user.id,
      });
      if (curUserTask) {
        await this.projectTaskTypeRepo.manager.update(
          UserTask,
          {
            taskId: checkedTask.id,
            userId: user.id,
          },
          userTask
        );

        const index =
          checkedTask.userTasks &&
          checkedTask.userTasks.findIndex((ut) => ut.userId === user.id && ut.taskId === checkedTask.id);
        if (index !== -1) {
          checkedTask.userTasks[index] = this.projectTaskTypeRepo.manager.merge(
            UserTask,
            checkedTask.userTasks[index],
            userTask
          );
        }
      } else {
        const newUserTask = this.projectTaskTypeRepo.manager.create(UserTask, {
          ...userTask,
          taskId: checkedTask.id,
          userId: user.id,
        });
        await this.projectTaskTypeRepo.manager.save(newUserTask);

        checkedTask.userTasks.push(newUserTask);
      }

      let urgCount = 0;
      let urgSum = 0;
      let complexCount = 0;
      let complexSum = 0;
      let valueSum = 0;
      let valueCount = 0;
      checkedTask.userTasks?.forEach((cur) => {
        if (cur.urgency) {
          urgCount++;
          urgSum += UserTask.getUrgency(cur.urgency);
        }
        if (cur.complexity) {
          complexCount++;
          complexSum += UserTask.getComplexity(cur.complexity);
        }
        if (cur.userValue) {
          valueCount++;
          valueSum += cur.userValue;
        }
      });
      value =
        (urgCount ? urgSum / urgCount : 1) *
        (complexCount ? complexSum / complexCount : 1) *
        (valueCount ? valueSum / valueCount : 1);
      value = Math.round(value * 4) / 4;
    }

    let transitStatus = checkedTask.statusTypeName;
    if (strategy.getIsTransit(checkedTask.statusTypeName)) {
      const objectForValidation = this.projectService.getTaskDataForStrategyValidation(checkedTask, user);
      const [resMove, errors] = strategy.pushForward(checkedTask.statusTypeName, objectForValidation);
      if (resMove && !errors?.length) {
        transitStatus = resMove.to;
      }
    }

    return [value, transitStatus];
  }

  private async parseTaskDtoToTaskObj(
    taskDto: TaskCreateDto | TaskUpdateDto,
    projectId: number,
    strategy: TaskFlowStrategy,
    createNew: boolean = false,
    manager?: EntityManager
  ): Promise<Partial<Task>> {
    const curManager = manager || this.projectTaskTypeRepo.manager;
    const preparedData: Partial<Task> = {};
    if (taskDto.projectParts) {
      const foundParts = taskDto.projectParts.length
        ? await this.taskService.findProjectParts(taskDto.projectParts, projectId, curManager)
        : [];
      if (foundParts.length !== taskDto.projectParts.length) {
        throw new ValidationException([
          Object.assign(new ValidationError(), {
            constraints: {
              isInvalid: 'Указаны неверные части проекта',
            },
            property: 'projectParts',
            value: taskDto.projectParts,
          }),
        ]);
      }
      preparedData.projectParts = foundParts;
    }
    if (taskDto.description !== undefined) {
      preparedData.description = taskDto.description;
    }
    if (taskDto.title !== undefined) {
      preparedData.title = taskDto.title;
    }
    if (strategy.strategy === TASK_FLOW_STRATEGY.SIMPLE && taskDto.value !== undefined) {
      preparedData.value = taskDto.value;
    }
    if (taskDto.source !== undefined) {
      preparedData.source = taskDto.source;
    }
    if (taskDto.statusTypeName !== undefined && createNew) {
      preparedData.statusTypeName = strategy.getCreatedStatus(taskDto.statusTypeName);
    }
    if (taskDto.typeId !== undefined) {
      if (!taskDto.typeId) {
        preparedData.typeId = null;
      } else {
        const projectTaskType = await curManager.findOne(ProjectTaskType, {
          where: {
            project: { id: projectId },
            taskType: { id: taskDto.typeId },
          },
        });
        if (!projectTaskType) {
          throw new ValidationException(undefined, 'Тип задачи не был найдет в текущем проекте');
        }
      }
      preparedData.typeId = taskDto.typeId;
    } else {
      const taskType = await curManager.findOne(TaskType, {
        where: {
          name: 'feature',
        },
      });
      if (!taskType) {
        throw new ValidationException(undefined, 'Тип задачи "feature" не был найдет в системе');
      }
      preparedData.typeId = taskType.id;
    }
    if (taskDto.performerId !== undefined) {
      if (!taskDto.performerId) {
        preparedData.performer = null;
      } else {
        const performer = await curManager.findOne(UserProject, {
          relations: ['member'],
          where: {
            member: { id: taskDto.performerId },
            project: { id: projectId },
          },
        });
        if (!performer) {
          throw new ValidationException(undefined, 'Исполнитель не был найдет в текущем проекте');
        }
        preparedData.performer = { id: performer.member.id } as User;
      }
    }

    return preparedData;
  }

  public async checkAccess(
    sequenceNumber: number,
    project: Project,
    user: User,
    statusLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED
  ): Promise<Task> {
    const checkedTask = await this.taskService.findOne(sequenceNumber, project, user);
    if (project.accessLevel.accessLevel < statusLevel) {
      if (checkedTask.performerId !== user.id) {
        throw new ForbiddenException({
          message: 'У вас нет доступа к этой задаче',
          task: checkedTask,
        });
      }
    }
    return checkedTask;
  }

  private async checkUserCanMove(
    project: Project,
    user: User,
    task: Task,
    taskMoveDto: TaskMoveDto,
    manager: EntityManager
  ): Promise<STATUS_NAME> {
    const strategy = await this.projectService.getCurrentUserStrategy(project, user, manager);
    const correctToStatus = strategy.canBeMoved(
      task.statusTypeName,
      taskMoveDto.statusTypeName,
      this.projectService.getTaskDataForStrategyValidation(task, user),
      taskMoveDto.selectedRole
    );
    if (!correctToStatus) {
      if (strategy.userStrategyRoles.length > 1) {
        throw new NotAcceptableException('Данное перемещение невозможно. Смени роль или заполни недостающие поля');
      }

      throw new NotAcceptableException(
        'Задача не может быть перемещена в этот статус' + ' без дополнительных корректировок'
      );
    }

    return correctToStatus;
  }

  private checkCanBeEdit(task: Task): void {
    if (task.isArchived) {
      throw new NotAcceptableException('Заархивированная задача не может быть изменена');
    }
    // TODO: проверить так же, была ли задача завершена, в соответсвии с обновленным FLOW задач
    if (task.statusTypeName === STATUS_NAME.DONE) {
      throw new NotAcceptableException(
        'Завершенная задача не может быть изменена! Это противоречит логике,' +
          ' ведь задача была оценена, описанная именно этим образом. Если мы изменим задачу после окончания,' +
          ' это будет означать, что мы должы изменить и ее оценку. Во избежание недоразумений,' +
          ' мы запрещаем изменять выполненные задачи.'
      );
    }
  }
}
