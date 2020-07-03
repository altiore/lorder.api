import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { EntityManager } from 'typeorm';

import { TaskComment } from '@orm/task-comment/task-comment.entity';

import { Task } from '../@orm/task';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { TaskService } from '../task/task.service';

@Injectable()
export class TaskCommentService extends TypeOrmCrudService<TaskComment> {
  constructor(@InjectRepository(TaskComment) repo, private readonly taskService: TaskService) {
    super(repo);
  }

  public async findTaskByIdAndCheckAccess(
    taskId: number,
    projectId: number,
    user: User,
    accessLevel: ACCESS_LEVEL = ACCESS_LEVEL.RED,
    manager?: EntityManager
  ): Promise<Task> {
    return this.taskService.findOneById(taskId, user, accessLevel, { projectId }, true, manager);
  }

  public async findOnById(id: number): Promise<TaskComment> {
    return await this.repo.findOne({ where: { id } });
  }
}
