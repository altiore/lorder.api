import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskStatusMove } from '../@orm/task-status-move/task-status-move.entity';

import { TaskStatusMoveController } from './task-status-move.controller';
import { TaskStatusMoveService } from './task-status-move.service';

@Module({
  controllers: [TaskStatusMoveController],
  exports: [TaskStatusMoveService],
  imports: [TypeOrmModule.forFeature([TaskStatusMove])],
  providers: [TaskStatusMoveService],
})
export class TaskStatusMoveModule {}
