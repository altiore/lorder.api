import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskStatus } from './task-status.entity';

import { TaskStatusController } from './task-status.controller';
import { TaskStatusService } from './task-status.service';

@Module({
  controllers: [TaskStatusController],
  exports: [TaskStatusService],
  imports: [TypeOrmModule.forFeature([TaskStatus])],
  providers: [TaskStatusService],
})
export class TaskStatusModule {}
