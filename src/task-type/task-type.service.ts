import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TaskType, TaskTypeCreateDto, TaskTypeRepository } from '../@orm/task-type';

@Injectable()
export class TaskTypeService {
  constructor(@InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository) {}

  public findAll(): Promise<TaskType[]> {
    return this.taskTypeRepo.findAll();
  }

  public create(tasktypeCreateDto: TaskTypeCreateDto): Promise<TaskType> {
    return this.taskTypeRepo.createOne(tasktypeCreateDto);
  }

  public update(id: number, taskTypeCreateDto: TaskTypeCreateDto): Promise<TaskType> {
    return this.taskTypeRepo.updateById(id, taskTypeCreateDto);
  }

  public async remove(id: number): Promise<void> {
    await this.taskTypeRepo.delete(id);
    return;
  }
}
