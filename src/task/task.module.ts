import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskRepository } from '../@orm/task';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  exports: [TaskService],
  imports: [AuthModule, ProjectModule, TypeOrmModule.forFeature([TaskRepository])],
  providers: [TaskService],
})
export class TaskModule {}
