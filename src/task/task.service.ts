import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { cloneDeep } from 'lodash';

import { Project } from '../@orm/project';
import { Task, TaskRepository } from '../@orm/task';
import { TASK_CHANGE_TYPE, TaskLogRepository } from '../@orm/task-log';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { ProjectService } from '../project/project.service';
import { TaskPagination } from './dto';

@Injectable()
export class TaskService {
  constructor(
    private projectService: ProjectService,
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(TaskLogRepository) private readonly taskLogRepo: TaskLogRepository
  ) {}

  public async findAll(pagesDto: TaskPagination, user: User): Promise<Task[]> {
    const userProjects = await this.projectService.findAllParticipantByUser(
      {},
      user,
      ACCESS_LEVEL.RED
    );
    const projectIds = userProjects.map(el => el.project.id);
    if (!projectIds.length) {
      return [];
    }

    return await this.taskRepo.findAllWithPagination(pagesDto, user, projectIds);
  }

  public async findOneByProjectId(taskId: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOneByProjectId(taskId, projectId);
  }

  public async findOne(taskId: number, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({
      relations: ['performer', 'userWorks', 'users'],
      where: {
        id: taskId,
      },
    });
    if (!task) {
      throw new NotFoundException('Задача не была найдена');
    }
    task.project = await this.projectService.findOneByMember(task.projectId, user);
    // Эта проверка ДОЛЖНА быть здесь. Если ее убрать, то можно будет в url написать проект, к которому есть доступ
    // и отредактировать произвольную задачу из произвольного проекта
    if (!task.project || !task.project.isAccess(ACCESS_LEVEL.RED)) {
      throw new ForbiddenException('Доступ к этой задаче запрещен');
    }
    task.children = await this.taskRepo.findDescendants(task);
    return task;
  }

  public async archive(id: number, user: User): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: {
        id,
        isArchived: false,
      },
    });

    if (!task) {
      throw new NotFoundException(
        'Задача не найдена. Возмжоно вы пытаетесь заархивировать уже заархивированную задачу'
      );
    }
    task.project = await this.projectService.findOneByMember(task.projectId, user);
    if (!task.project || !task.project.isAccess(ACCESS_LEVEL.YELLOW)) {
      throw new ForbiddenException(
        'Архивировать задачи могут пользователи начиная с Желтого уровня'
      );
    }

    await this.taskRepo.manager.transaction(async entityManager => {
      const prevTaskVersion = cloneDeep(task);
      task.isArchived = true;
      await entityManager.save(task);
      const taskLog = this.taskLogRepo.createTaskLogByType(
        TASK_CHANGE_TYPE.ARCHIVE,
        task,
        user,
        prevTaskVersion
      );
      await entityManager.save(taskLog);
    });

    return task;
  }

  async createByProject(taskData: Partial<Task>, project: Project, user: User): Promise<Task> {
    let task: Task;
    await this.taskRepo.manager.transaction(async entityManager => {
      task = this.taskRepo.createByProject(taskData, project);
      task.performerId = taskData.performerId || user.id;
      task.users = [user];
      task = await entityManager.save(task);

      const taskLog = this.taskLogRepo.createTaskLogByType(TASK_CHANGE_TYPE.CREATE, task, user, {});
      await entityManager.save(taskLog);
    });
    return task;
  }

  async updateByUser(task: Task, newTaskData: Partial<Task>, user: User): Promise<Task> {
    let updatedTask: Task;
    await this.taskRepo.manager.transaction(async entityManager => {
      const changeType =
        typeof newTaskData.status !== 'undefined' && task.status !== newTaskData.status
          ? TASK_CHANGE_TYPE.MOVE
          : TASK_CHANGE_TYPE.UPDATE;
      const taskLog = this.taskLogRepo.createTaskLogByType(changeType, task, user);
      await entityManager.save(taskLog);

      updatedTask = this.taskRepo.merge(task, newTaskData);
      await entityManager.save(updatedTask);
    });
    return updatedTask;
  }
}
