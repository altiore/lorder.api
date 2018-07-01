import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskRepository } from '../@entities/task';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [],
})
export class TaskModule {}
