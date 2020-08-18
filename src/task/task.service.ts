import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteResult, EntityManager, In, IsNull } from 'typeorm';

import { Project } from '@orm/project';
import { ProjectPart } from '@orm/project-part/project-part.entity';
import { Task, TaskRepository } from '@orm/task';
import { TaskLogRepository, TASK_CHANGE_TYPE } from '@orm/task-log';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';

import { ListResponseDto, PaginationDto } from '../@common/dto';
import { STATUS_NAME } from '../@domains/strategy';
import { UserWork } from '../@orm/user-work';
import { ProjectPartService } from '../project-part/project-part.service';
import { ProjectService } from '../project/project.service';
import { TaskPagination } from './dto';
import { TaskGateway } from './task.gateway';

@Injectable()
export class TaskService {
  constructor(
    private projectService: ProjectService,
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(TaskLogRepository) private readonly taskLogRepo: TaskLogRepository,
    private readonly taskGateway: TaskGateway,
    private readonly projectPartService: ProjectPartService
  ) {}

  public async findAllByProject(pagesDto: PaginationDto, project: Project, user: User): Promise<ListResponseDto<Task>> {
    const count = (pagesDto.count || 20) * 1;
    const page = (pagesDto.skip || 0) / count + 1;
    const strategy = await this.projectService.getCurrentUserStrategy(project, user, this.taskRepo.manager);

    // Найти только задачи, доступные пользователю в текущем статусе
    const [data, total] = await this.taskRepo.findAllByProjectId(pagesDto, project.id, strategy.availableStatuses);
    const pageCount = Math.ceil(total / count);
    return { count, data, page, pageCount, total };
  }

  public findOneBySequenceNumber(sequenceNumber: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOne({
      where: { sequenceNumber, project: { id: projectId } },
      relations: ['projectParts', 'userTasks'],
    });
  }

  public async findAll(pagesDto: TaskPagination, user: User): Promise<Task[]> {
    const userProjects = await this.projectService.findAllParticipantByUser({}, user, ACCESS_LEVEL.RED);
    if (!userProjects || !userProjects.length) {
      return [];
    }

    return await this.taskRepo.findTasksWithPagination(pagesDto, user, userProjects);
  }

  public async deleteBySequenceNumber(sequenceNumber: number, projectId: number): Promise<DeleteResult> {
    return await this.taskRepo.delete({ sequenceNumber, project: { id: projectId } });
  }

  public async findOneBySNAndProject(
    sequenceNumber: number,
    projectId: number,
    user: User,
    accessLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED,
    where = {},
    withoutRelations = false,
    manager?: EntityManager
  ): Promise<Task> {
    const curManager = manager || this.taskRepo.manager;
    const task = await curManager.findOne(Task, {
      relations: withoutRelations ? [] : ['performer', 'userWorks', 'userTasks'],
      where: {
        sequenceNumber,
        projectId,
        ...where,
      },
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена');
    }
    task.project = await this.projectService.findOneByMember(task.projectId, user, curManager);
    // Эта проверка ДОЛЖНА быть здесь. Если ее убрать, то можно будет в url написать проект, к которому есть доступ
    // и отредактировать произвольную задачу из произвольного проекта
    if (!task.project || !task.project.isAccess(accessLevel)) {
      throw new ForbiddenException('Доступ к этой задаче запрещен');
    }
    return task;
  }

  public async findOneById(
    taskId: number,
    user: User,
    accessLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED,
    where = {},
    withoutRelations = false,
    manager?: EntityManager
  ): Promise<Task> {
    const curManager = manager || this.taskRepo.manager;
    const task = await curManager.findOne(Task, {
      relations: withoutRelations ? [] : ['performer', 'userWorks', 'userTasks'],
      where: {
        id: taskId,
        ...where,
      },
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена');
    }
    task.project = await this.projectService.findOneByMember(task.projectId, user, curManager);
    // Эта проверка ДОЛЖНА быть здесь. Если ее убрать, то можно будет в url написать проект, к которому есть доступ
    // и отредактировать произвольную задачу из произвольного проекта
    if (!task.project || !task.project.isAccess(accessLevel)) {
      throw new ForbiddenException('Доступ к этой задаче запрещен');
    }
    return task;
  }

  public async archive(taskId: number, user: User): Promise<Task> {
    let task = await this.findOneById(taskId, user, ACCESS_LEVEL.YELLOW, { isArchived: false });

    if (task) {
      const userWork = await this.taskRepo.manager.findOne(UserWork, { finishAt: IsNull(), taskId: task.id });
      if (userWork) {
        throw new NotAcceptableException('Вы не можете заархивировать задачу, которая сейчас в работе!');
      }
      await this.taskRepo.manager.transaction(async (entityManager) => {
        task = await this.updateByUser(task, { isArchived: true }, user, entityManager);
      });
    }

    return task;
  }

  public async findOne(sequenceNumber: number, project: Project, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({
      relations: ['performer', 'userWorks', 'userTasks'],
      where: {
        project,
        sequenceNumber,
      },
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена');
    }
    return task;
  }

  public async findOneByIdWithUserTasks(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      relations: ['userTasks'],
      where: { id },
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена');
    }
    return task;
  }

  /**
   * TODO: send currently created task using sockets
   */
  async createByProject(taskData: Partial<Task>, project: Project, user: User, manager?: EntityManager): Promise<Task> {
    const curManager = manager || this.taskRepo.manager;
    const prepareTaskData = {
      ...taskData,
      performerId: taskData.performerId || user.id,
      status: typeof taskData.status === 'number' ? taskData.status : 0,
      statusTypeName: typeof taskData.statusTypeName === 'string' ? taskData.statusTypeName : STATUS_NAME.CREATING,
    };
    const task = await this.taskRepo.createByProject(prepareTaskData, project, curManager);

    const taskLog = this.taskLogRepo.createTaskLogByType(TASK_CHANGE_TYPE.CREATE, task, user, {});
    await curManager.save(taskLog);
    return task;
  }

  async updateByUser(task: Task, newTaskData: Partial<Task>, user: User, manager?: EntityManager): Promise<Task> {
    let updatedTask: Task = task;
    const entityManager = manager || this.taskRepo.manager;
    try {
      if (!task.id) {
        throw new NotAcceptableException('Task должен быть вилидной сохраненной задачей');
      }
      const changeType =
        typeof newTaskData.statusTypeName !== 'undefined' && task.statusTypeName !== newTaskData.statusTypeName
          ? TASK_CHANGE_TYPE.MOVE
          : TASK_CHANGE_TYPE.UPDATE;
      await entityManager.save(this.taskLogRepo.createTaskLogByType(changeType, task, user));
      updatedTask = await this.updateTask(task, newTaskData, entityManager);
      return updatedTask;
    } catch (e) {
      throw new NotAcceptableException('Не удается изменить задачу...');
    }
  }

  async findProjectParts(ids: number[], projectId: number, manager: EntityManager): Promise<ProjectPart[]> {
    return this.projectPartService.findManyByIds(ids, projectId, manager);
  }

  private async updateTask(task: Task | number, taskData: Partial<Task>, manager?: EntityManager): Promise<Task> {
    const curTask = typeof task === 'number' ? ({ id: task } as Task) : task;
    const curManager = manager || this.taskRepo.manager;
    const preparedData = { ...taskData };

    let projectParts: ProjectPart[];
    if (taskData.projectParts) {
      projectParts = taskData.projectParts.slice(0);
      delete preparedData.projectParts;
    }
    await curManager.update(Task, { id: curTask.id }, preparedData);
    // TODO: fix when will be fixed bug with relations saving inside Typeorm
    if (projectParts) {
      await curManager.query(`DELETE from "task_project_parts_project_part" WHERE "taskId"=${curTask.id}`);
      if (projectParts.length) {
        await curManager.query(
          `INSERT INTO "task_project_parts_project_part" ("taskId", "projectPartId") VALUES ${projectParts
            .map(({ id }) => `(${curTask.id}, ${id})`)
            .join(',')}`
        );
      }
    }
    const updatedTask = this.taskRepo.merge(curTask, taskData);
    this.taskGateway.updateTaskForAll(updatedTask);
    return updatedTask;
  }
}
