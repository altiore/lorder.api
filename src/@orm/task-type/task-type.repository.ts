import { EntityRepository, Repository } from 'typeorm';

import { TaskType } from '../entities/task-type.entity';
import { TaskTypeCreateDto } from './dto';

@EntityRepository(TaskType)
export class TaskTypeRepository extends Repository<TaskType> {
  public createOne(data: TaskTypeCreateDto): Promise<TaskType> {
    const entity = this.create(data);
    return this.save(entity);
  }

  public findAll(): Promise<TaskType[]> {
    return this.find();
  }
}
