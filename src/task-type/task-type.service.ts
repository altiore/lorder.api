import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskType, TaskTypeCreateDto, TaskTypeRepository } from '../@entities/task-type';

@Injectable()
export class TaskTypeService {
  constructor(@InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository) {}

  public findAll(): Promise<TaskType[]> {
    return this.taskTypeRepo.findAll();
  }

  public create(tasktypeCreateDto: TaskTypeCreateDto): Promise<TaskType> {
    return this.taskTypeRepo.createTaskType(tasktypeCreateDto);
  }

  public update(id: number, taskTypeCreateDto: TaskTypeCreateDto): Promise<TaskType> {
    return this.taskTypeRepo.updateById(id, taskTypeCreateDto);
  }

  /**
  public delete() {
    return ['deleted'];
  }
*/

  public async remove(id: number): Promise<void> {
    await this.taskTypeRepo.delete(id);
    return;
  }
}
