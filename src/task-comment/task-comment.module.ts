import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskComment } from '@orm/entities/task-comment.entity';

import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { TaskCommentController } from './task-comment.controller';
import { TaskCommentService } from './task-comment.service';

@Module({
  controllers: [TaskCommentController],
  exports: [TaskCommentService],
  imports: [ProjectModule, TaskModule, TypeOrmModule.forFeature([TaskComment])],
  providers: [TaskCommentService],
})
export class TaskCommentModule {}
