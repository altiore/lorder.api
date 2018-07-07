import { EntityRepository, Repository } from 'typeorm';

import { TaskTypeCreateDto } from './dto';
import { TaskType } from './tasktype.entity';

@EntityRepository(TaskType)
export class TaskTypeRepository extends Repository<TaskType> {
  public createTaskType(data: TaskTypeCreateDto): Promise<TaskType> {
    const entity = this.create(data);
    return this.save(entity);
  }

  public findAll(): Promise<TaskType[]> {
    return this.find();
  }

  public async updateById(id: number, data: TaskTypeCreateDto): Promise<TaskType> {
    let entity = await this.findOneOrFail(id);
    entity = this.merge(entity, data);
    return this.save(entity);
  }
}
