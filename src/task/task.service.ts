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
}
