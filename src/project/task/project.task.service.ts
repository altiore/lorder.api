import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { ValidationException } from '../../@common/exceptions/validation.exception';
import { Project } from '../../@orm/project';
import { ProjectTaskTypeRepository } from '../../@orm/project-task-type';
import { Task, TaskRepository } from '../../@orm/task';
import { TaskTypeRepository } from '../../@orm/task-type';
import { User, UserRepository } from '../../@orm/user';
import { ACCESS_LEVEL, UserProjectRepository } from '../../@orm/user-project';
import { TaskService } from '../../task/task.service';
import { TaskCreateDto, TaskMoveDto, TaskUpdateDto } from './dto';
import { ProjectTaskGateway } from './project.task.gateway';

@Injectable()
export class ProjectTaskService {
  constructor(
    // TODO: remove taskRepo from this file and use taskService instead!!!
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(UserProjectRepository)
    private readonly userProjectRepo: UserProjectRepository,
    @InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository,
    @InjectRepository(ProjectTaskTypeRepository)
    private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
    private readonly taskGateway: ProjectTaskGateway,
    private readonly taskService: TaskService
  ) {}

  public async findAll(pagesDto: PaginationDto, projectId: number): Promise<Task[]> {
    return await this.taskRepo.findAllByProjectId(pagesDto, projectId);
  }

  public findOne(id: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOneByProjectId(id, projectId);
  }

  public async create(taskCreateDto: TaskCreateDto, project: Project, user: User): Promise<Task> {
    const preparedData = await this.parseTaskDtoToTaskObj(taskCreateDto, project.id);
    return await this.taskService.createByProject(preparedData, project, user);
  }

  public async update(
    taskId: number,
    taskUpdateDto: TaskUpdateDto,
    project: Project,
    user: User
  ): Promise<Task> {
    // 1. Проверить соответсвие проекта задаче и уровень доступа пользователя к проекту
    const checkedTask = await this.checkAccess(taskId, project, user, ACCESS_LEVEL.YELLOW);
    // 2. Подготовить данные для обновления задачи
    const preparedData = await this.parseTaskDtoToTaskObj(taskUpdateDto, project.id);
    // 3. Обновить задачу
    const updatedTask = await this.taskService.updateByUser(checkedTask, preparedData, user);
    // 4. Отправить всем пользователям обновленные данные задачи
    this.taskGateway.updateTaskForAll(updatedTask);
    // 5. Вернуть измененную задачу
    return updatedTask;
  }

  public async move(
    taskId: number,
    project: Project,
    user: User,
    taskMoveDto: TaskMoveDto
  ): Promise<Task> {
    // 1. Проверить соответсвие проекта задаче и уровень доступа пользователя к проекту
    const checkedTask = await this.checkAccess(taskId, project, user);
    // 2. TODO: проверить разрешенное перемещение задачи для данного статуса
    // 3. TODO: проверить разрешенное перемещение задачи для данного пользователя
    // 4. Обновить и вернуть обновленную задачу
    return this.taskService.updateByUser(checkedTask, taskMoveDto, user);
  }

  public async delete(id: number, projectId: number): Promise<Task | false> {
    const task = await this.findOne(id, projectId);
    if (!task) {
      return false;
    }
    await this.taskRepo.delete({ id });
    return task;
  }

  private async checkAccess(
    taskId: number,
    project: Project,
    user: User,
    statusLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED
  ): Promise<Task> {
    const checkedTask = await this.taskService.findOne(taskId, user);
    if (project.id !== checkedTask.projectId) {
      throw new ForbiddenException({
        message:
          'Вы пытаетесь отредактировать задачу, которая не принадлежит выбранному проекту.' +
          ' Скорее всего, вы пытаетесь взломать сайт, но мы вам этого не позволим! ;)',
      });
    }
    if (project.accessLevel.accessLevel < statusLevel) {
      if (checkedTask.performerId !== user.id) {
        throw new ForbiddenException({
          message: 'Ваш уровень доступа позволяет редактировать только назначенные на вас задачи!',
          task: checkedTask,
        });
      }
    }
    return checkedTask;
  }

  private async parseTaskDtoToTaskObj(
    taskDto: TaskCreateDto | TaskUpdateDto,
    projectId: number
  ): Promise<Partial<Task>> {
    const preparedData: Partial<Task> = {};
    if (taskDto.description !== undefined) {
      preparedData.description = taskDto.description;
    }
    if (taskDto.title !== undefined) {
      preparedData.title = taskDto.title;
    }
    if (taskDto.value !== undefined) {
      preparedData.value = taskDto.value;
    }
    if (taskDto.source !== undefined) {
      preparedData.source = taskDto.source;
    }
    if (taskDto.status !== undefined) {
      preparedData.status = taskDto.status;
    }
    if (taskDto.typeId !== undefined) {
      if (!taskDto.typeId) {
        preparedData.typeId = null;
      } else {
        const projectTaskType = await this.projectTaskTypeRepo.findOne({
          where: {
            project: { id: projectId },
            taskType: { id: taskDto.typeId },
          },
        });
        if (!projectTaskType) {
          throw new ValidationException(undefined, 'Тип задачи не был найдет в текущем проекте');
        }
        preparedData.type = projectTaskType.taskType;
      }
      preparedData.typeId = taskDto.typeId;
    }
    if (taskDto.performerId !== undefined) {
      if (!taskDto.performerId) {
        preparedData.performer = null;
      } else {
        const performer = await this.userProjectRepo.findOne({
          relations: ['member'],
          where: {
            member: { id: taskDto.performerId },
            project: { id: projectId },
          },
        });
        if (!performer) {
          throw new ValidationException(undefined, 'Исполнитель не был найдет в текущем проекте');
        }
        preparedData.performer = performer.member;
      }
    }

    if (taskDto.users && taskDto.users.length) {
      preparedData.users = await this.userRepo.findAllByIds(taskDto.users);
      if (taskDto.users.length !== preparedData.users.length) {
        throw new ValidationException(undefined, 'Не все пльзователи были найдены');
      }
    }
    return preparedData;
  }
}
