import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskTypeRepository } from '../@orm/task-type';

import { TaskTypeController } from './task-type.controller';
import { TaskTypeService } from './task-type.service';

@Module({
  controllers: [TaskTypeController],
  exports: [TaskTypeService],
  imports: [TypeOrmModule.forFeature([TaskTypeRepository])],
  providers: [TaskTypeService],
})
export class TaskTypeModule {}
