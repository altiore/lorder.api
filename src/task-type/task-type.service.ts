import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { TaskType } from '@orm/entities/task-type.entity';

@Injectable()
export class TaskTypeService extends TypeOrmCrudService<TaskType> {
  constructor(@InjectRepository(TaskType) repo) {
    super(repo);
  }
}
