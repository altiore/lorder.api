import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { ValidationException } from '../../@common/exceptions/validation.exception';
import { Project } from '../../@orm/project';
import { Task, TaskRepository } from '../../@orm/task';
import { User, UserRepository } from '../../@orm/user';
import { UserProjectRepository } from '../../@orm/user-project';
import { TaskCreateDto, TaskMoveDto, TaskUpdateDto } from './dto';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(UserProjectRepository) private readonly userProjectRepo: UserProjectRepository
  ) {}

  public findAll(pagesDto: PaginationDto, projectId: number): Promise<Task[]> {
    return this.taskRepo.findAllByProjectId(pagesDto, projectId);
  }

  public findOne(id: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOneByProjectId(id, projectId);
  }

  public async create(taskCreateDto: TaskCreateDto, projectId: number): Promise<Task> {
    const preparedData = await this.parseTaskDtoToTaskObj(taskCreateDto, projectId);
    return this.taskRepo.createByProjectId(preparedData, projectId);
  }

  public async update(id: number, taskUpdateDto: TaskUpdateDto, projectId: number): Promise<Task> {
    const preparedData = await this.parseTaskDtoToTaskObj(taskUpdateDto, projectId);
    return this.taskRepo.updateByProjectId(id, preparedData, projectId);
  }

  public async move(task: Task, project: Project, user: User, taskMoveDto: TaskMoveDto): Promise<Task> {
    // 1. TODO: проверить разрешенное перемещение задачи для данного статуса
    // 2. TODO: проверить разрешенное перемещение задачи для данного пользователя
    return this.taskRepo.updateByProjectId(task.id, taskMoveDto, project.id);
  }

  public async delete(id: number, projectId: number): Promise<Task | false> {
    const task = await this.findOne(id, projectId);
    if (!task) {
      return false;
    }
    await this.taskRepo.delete({ id });
    return task;
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
