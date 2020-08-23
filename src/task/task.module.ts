import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskLogRepository } from '@orm/task-log/task-log.repository';
import { TaskRepository } from '@orm/task/task.repository';

import { AuthModule } from 'auth/auth.module';

import { ProjectPartModule } from '../project-part/project-part.module';
import { ProjectModule } from '../project/project.module';
import { TaskController } from './task.controller';
import { TaskGateway } from './task.gateway';
import { TaskService } from './task.service';

@Module({
  controllers: [TaskController],
  exports: [TaskService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => ProjectPartModule),
    TypeOrmModule.forFeature([TaskRepository, TaskLogRepository]),
  ],
  providers: [TaskGateway, TaskService],
})
export class TaskModule {}
