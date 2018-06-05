import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { Project } from './project.entity';
import { ProjectDto } from './dto';
import { User } from '../user/user.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {

  public findAllByOwner(owner: User): Promise<Project[]> {
    return this.find({ where: { owner }, relations: ['owner'], loadRelationIds: true });
  }

  public async findOneByOwner(id: number, owner: User): Promise<Project> {
    const project = await this.findOne({ where: { id, owner }, relations: ['owner'], loadRelationIds: true });
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  public createByUser(data: ProjectDto, creator: User): Promise<Project> {
    const project = this.create(data);
    project.creator = creator;
    project.updator = creator;
    project.owner = creator;
    return this.save(project);
  }

}