import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project, ProjectRepository, ProjectDto } from '../@entities/project';
import { User } from '../@entities/user';

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository) {}

  public findAll(user: User): Promise<Project[]> {
    return this.projectRepo.findAllByOwner(user);
  }

  public findOne(id: number, user: User): Promise<Project> {
    return this.projectRepo.findOneByOwner(id, user);
  }

  public create(data: ProjectDto, user: User): Promise<Project> {
    return this.projectRepo.createByUser(data, user);
  }
}
