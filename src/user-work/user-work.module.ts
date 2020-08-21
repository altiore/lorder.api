import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWorkRepository } from '@orm/user-work';

import { ProjectModule } from '../project/project.module';
import { TaskCommentModule } from '../task-comment/task-comment.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { UserWorkController } from './user-work.controller';
import { UserWorkService } from './user-work.service';

@Module({
  controllers: [UserWorkController],
  exports: [UserWorkService],
  imports: [ProjectModule, TaskModule, TaskCommentModule, UserModule, TypeOrmModule.forFeature([UserWorkRepository])],
  providers: [UserWorkService],
})
export class UserWorkModule {}
