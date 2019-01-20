import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Task, TaskRepository } from '../@orm/task';
import { User } from '../@orm/user';
import { TaskPagination } from './dto';

@Injectable()
export class TaskService {
  constructor(@InjectRepository(TaskRepository) private readonly taskRepo: TaskRepository) {}

  public findAll(pagesDto: TaskPagination, user: User): Promise<Task[]> {
    return this.taskRepo.findAllWithPagination(pagesDto, user);
  }

  public async archive(id: number, user: User): Promise<Task | false> {
    const task = await this.taskRepo.findOneByOwner(id, user.id);

    if (!task) {
      return false;
    }

    task.isArchived = true;

    await this.taskRepo.save(task);

    return task;
  }
}
