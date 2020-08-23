import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { EntityManager } from 'typeorm';

import { TaskComment } from '@orm/entities/task-comment.entity';
import { Task } from '@orm/entities/task.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';
import { User } from '@orm/entities/user.entity';

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

  public async updateCommentsCount(taskId: number): Promise<void> {
    await this.repo.manager.query(`
      UPDATE
        "task"
      SET
        "commentsCount"=(SELECT COUNT(*) FROM "task_comment" WHERE "taskId" = ${taskId})
      WHERE "id" = ${taskId}
    `);
  }

  public async createNewComment(text: string, task: Task, user: User, manager: EntityManager): Promise<TaskComment> {
    let comment = this.repo.create({ text, taskId: task.id, userId: user.id });
    comment = await manager.save(comment);
    comment.user = user;
    return comment;
  }
}
