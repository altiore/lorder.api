import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskLogRepository } from '@orm/task-log';

import { ProjectModule } from '../../project.module';

import { TaskLogController } from './task-log.controller';
import { TaskLogService } from './task-log.service';

@Module({
  controllers: [TaskLogController],
  exports: [TaskLogService],
  imports: [forwardRef(() => ProjectModule), TypeOrmModule.forFeature([TaskLogRepository])],
  providers: [TaskLogService],
})
export class TaskLogModule {}
