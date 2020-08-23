import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { TaskStatus } from '../@orm/entities/task-status.entity';

@Injectable()
export class TaskStatusService extends TypeOrmCrudService<TaskStatus> {
  constructor(@InjectRepository(TaskStatus) repo) {
    super(repo);
  }
}
