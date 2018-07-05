import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskTypeRepository } from '../@entities/task-type';
import { TaskTypeController } from './tasktype.controller';
import { TaskTypeService } from './tasktype.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskTypeRepository])],
  controllers: [TaskTypeController],
  providers: [TaskTypeService],
  exports: [TaskTypeService],
})
export class TaskTypeModule {}
