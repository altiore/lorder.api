import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project, ProjectRepository, ProjectDto } from '../@entities/project';
import { User } from '../@entities/user';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectRepository)
    private readonly projectRepo: ProjectRepository,
  ) {}

  public findAll(user: User): Promise<Project[]> {
    // TODO: return only Project, which belongs to user
    return this.projectRepo.find();
  }

  public async findOne(id: number): Promise<Project> {
    return await this.projectRepo.findOneOrFail(id);
  }

  public async create(data: ProjectDto): Promise<Project> {
    const project = this.projectRepo.create(data);
    return await this.projectRepo.save(project);
  }
}
