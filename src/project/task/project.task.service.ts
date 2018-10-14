import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task, TaskRepository } from '../../@orm/task';
import { TaskCreateDto } from './dto';

@Injectable()
export class ProjectTaskService {
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

  public async delete(id: number, projectId: number): Promise<Task | false> {
    const task = await this.findOne(id, projectId);
    if (!task) {
      return false;
    }
    await this.taskRepo.delete({ id });
    return task;
  }
}
