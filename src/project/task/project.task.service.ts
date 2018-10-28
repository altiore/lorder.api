import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { ValidationException } from '../../@common/exceptions/validation.exception';
import { Task, TaskRepository } from '../../@orm/task';
import { UserRepository } from '../../@orm/user';
import { TaskCreateDto, TaskUpdateDto } from './dto';

@Injectable()
export class ProjectTaskService {
  constructor(
    @InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository,
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository
  ) {}

  public findAll(pagesDto: PaginationDto, projectId: number): Promise<Task[]> {
    return this.taskRepo.findAllByProjectId(pagesDto, projectId);
  }

  public findOne(id: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOneByProjectId(id, projectId);
  }

  public async create(taskCreateDto: TaskCreateDto, projectId: number): Promise<Task> {
    const preparedData = await this.parseTaskDtoToTaskObj(taskCreateDto);
    return this.taskRepo.createByProjectId(preparedData, projectId);
  }

  public async update(id: number, taskUpdateDto: TaskUpdateDto, projectId: number): Promise<Task> {
    const preparedData = await this.parseTaskDtoToTaskObj(taskUpdateDto);
    return this.taskRepo.updateByProjectId(id, preparedData, projectId);
  }

  public async delete(id: number, projectId: number): Promise<Task | false> {
    const task = await this.findOne(id, projectId);
    if (!task) {
      return false;
    }
    await this.taskRepo.delete({ id });
    return task;
  }

  private async parseTaskDtoToTaskObj(taskDto: TaskCreateDto | TaskUpdateDto): Promise<Partial<Task>> {
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

    if (taskDto.users && taskDto.users.length) {
      preparedData.users = await this.userRepo.findAllByIds(taskDto.users);
      if (taskDto.users.length !== preparedData.users.length) {
        throw new ValidationException(undefined, 'Не все пльзователи были найдены');
      }
    }
    return preparedData;
  }
}
