import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskTypeRepository } from '../@orm/task-type';
import { TaskTypeController } from './task-type.controller';
import { TaskTypeService } from './task-type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTypeRepository])],
  controllers: [TaskTypeController],
  providers: [TaskTypeService],
  exports: [TaskTypeService],
})
export class TaskTypeModule {}
