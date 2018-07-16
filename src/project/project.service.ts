import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project, ProjectRepository, ProjectDto } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { User } from '../@orm/user';
import { TaskTypeDto } from './dto/task-type.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
    @InjectRepository(ProjectRepository) private readonly taskTypeRepo: TaskTypeRepository,
    @InjectRepository(ProjectRepository) private readonly projectTaskTypeRepo: ProjectTaskTypeRepository,
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

  public async update(project: Project, taskTypesIds: TaskTypeDto[]): Promise<Project> {
    const taskTypes = await this.taskTypeRepo.findByIds(taskTypesIds);
    const projectTaskTypes = this.projectTaskTypeRepo.cre
    return this.projectRepo.replaceTaskTypes(project, taskTypes);
  }
}
