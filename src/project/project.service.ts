import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In } from 'typeorm';

import { Project, ProjectRepository, ProjectDto } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { User } from '../@orm/user';
import { TaskTypesDto } from './dto/task-types.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(TaskTypeRepository) private readonly taskTypeRepo: TaskTypeRepository,
    @InjectRepository(ProjectTaskTypeRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
  ) {}

  public findAll(user: User): Promise<Project[]> {
    return this.projectRepo.findAllByOwner(user);
  }

  public findOne(id: number, user: User): Promise<Project> {
    return this.projectRepo.findOneByOwner(id, user);
  }

  public create(data: ProjectDto, user: User): Promise<Project> {
    return this.projectRepo.createByUser(data, user);
  }

  public async update(project: Project, taskTypesIds: number[]): Promise<any> {
    const taskTypes = await this.taskTypeRepo.findByIds(taskTypesIds);
    if (taskTypes.length !== taskTypesIds.length) {
      throw new NotAcceptableException(
        'Недопустимый id taskType был передан.' +
          ' Пожалуйста, убедитесь, что все сущности были созданы предварительно',
      );
    }
    // const projectTaskTypes = this.projectTaskTypeRepo.createMultipleByProjectAndTaskTypes(project, taskTypes);
    try {
      return await this.projectTaskTypeRepo.createMultiple(project, taskTypes);
    } catch (e) {
      console.log(e);
      return 'error';
    }
    // return this.projectRepo.replaceTaskTypes(project, projectTaskTypes);
  }
}
