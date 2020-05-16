import { ForbiddenException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@orm/project';
import { Task, TASK_SIMPLE_STATUS, TaskRepository } from '@orm/task';
import { TASK_CHANGE_TYPE, TaskLogRepository } from '@orm/task-log';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';
import { DeleteResult, EntityManager } from 'typeorm';

import { ListResponseDto, PaginationDto } from '../@common/dto';
import { ProjectService } from '../project/project.service';

import { TaskPagination } from './dto';
import { TaskGateway } from './task.gateway';

@Injectable()
export class TaskService {
  constructor(
    private projectService: ProjectService,
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(TaskLogRepository) private readonly taskLogRepo: TaskLogRepository,
    private readonly taskGateway: TaskGateway
  ) {}

  public async findAllByProject(pagesDto: PaginationDto, projectId: number): Promise<ListResponseDto<Task>> {
    const [list, total] = await this.taskRepo.findAllByProjectId(pagesDto, projectId);
    return { list, total };
  }

  public findOneBySequenceNumber(sequenceNumber: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOneByProjectId(sequenceNumber, projectId);
  }

  public async findAll(pagesDto: TaskPagination, user: User): Promise<Task[]> {
    const userProjects = await this.projectService.findAllParticipantByUser({}, user, ACCESS_LEVEL.RED);
    const projectIds = userProjects.map(el => el.project.id).filter(id => id !== user.defaultProjectId);
    if (!projectIds.length) {
      return [];
    }

    return await this.taskRepo.findAllWithPagination(pagesDto, user, projectIds);
  }

  public async deleteBySequenceNumber(sequenceNumber: number, projectId: number): Promise<DeleteResult> {
    return await this.taskRepo.delete({ sequenceNumber, project: { id: projectId } });
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
      await this.taskRepo.manager.transaction(async entityManager => {
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
      status: typeof taskData.status === 'number' ? taskData.status : TASK_SIMPLE_STATUS.JUST_CREATED,
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
        typeof newTaskData.status !== 'undefined' && task.status !== newTaskData.status
          ? TASK_CHANGE_TYPE.MOVE
          : TASK_CHANGE_TYPE.UPDATE;
      await entityManager.save(this.taskLogRepo.createTaskLogByType(changeType, task, user));
      updatedTask = await this.updateTask(task.id, newTaskData, entityManager);
      return updatedTask;
    } catch (e) {
      throw new NotAcceptableException('Не удается изменить задачу...');
    }
  }

  private async updateTask(task: Task | number, taskData: Partial<Task>, manager?: EntityManager): Promise<Task> {
    const curManager = manager || this.taskRepo.manager;
    await curManager.update(Task, { id: typeof task === 'number' ? task : task.id }, taskData);
    const updatedTask = this.taskRepo.merge(typeof task === 'number' ? ({ id: task } as Task) : task, taskData);
    this.taskGateway.updateTaskForAll(updatedTask);
    return updatedTask;
  }
}
