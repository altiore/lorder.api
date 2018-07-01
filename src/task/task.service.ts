import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task, TaskCreateDto, TaskRepository } from '../@entities/task';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository) {}

  public findAll(projectId): Promise<Task[]> {
    return this.taskRepo.findAllByProjectId(projectId);
  }

  public findOne(id: number, projectId: number): Promise<Task> {
    return this.taskRepo.findOneByProjectId(id, projectId);
  }

  public create(taskCreateDto: TaskCreateDto, projectId: number): Promise<Task> {
    return this.taskRepo.createByProjectId(taskCreateDto, projectId);
  }

  public update(id: number, taskCreateDto: TaskCreateDto, projectId: number): Promise<Task> {
    return this.taskRepo.updateByProjectId(id, taskCreateDto, projectId);
  }
}
