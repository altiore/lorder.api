import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, DeleteResult } from 'typeorm';

import { Project } from '@orm/project';
import { ProjectTaskType, ProjectTaskTypeRepository } from '@orm/project-task-type';

import { TaskTypeRepository } from '../../@orm/task-type/task-type.repository';

@Injectable()
export class ProjectTaskTypeService {
  constructor(
    @InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository,
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository
  ) {}

  public async all(project: DeepPartial<Project>): Promise<ProjectTaskType[]> {
    return await this.projectTaskTypeRepo.findAllByProject(project);
  }

  public async addTaskType(project: DeepPartial<Project>, taskTypeId: number): Promise<any> {
    const taskType = await this.taskTypeRepo.findOne(taskTypeId);
    if (!taskType) {
      throw new NotFoundException('Тип задачи не был найден');
    }
    return this.projectTaskTypeRepo.addToProject(project, taskType);
  }

  public async removeFromProject(project: DeepPartial<Project>, taskTypeId: number): Promise<DeleteResult> {
    const taskType = await this.taskTypeRepo.findOne(taskTypeId);
    if (!taskType) {
      throw new NotFoundException('Тип задачи не был найден');
    }
    return this.projectTaskTypeRepo.removeFromProject(project, taskType);
  }

  public async update(project: DeepPartial<Project>, taskTypesIds: number[]): Promise<any> {
    const taskTypes = await this.taskTypeRepo.findByIds(taskTypesIds);
    if (taskTypes.length !== taskTypesIds.length) {
      throw new NotAcceptableException(
        'Недопустимый id taskType был передан.' + ' Пожалуйста, убедитесь, что все сущности были созданы предварительно'
      );
    }
    try {
      return await this.projectTaskTypeRepo.createMultiple(project, taskTypes);
    } catch (e) {
      return 'error';
    }
  }
}
