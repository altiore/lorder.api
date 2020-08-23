import { EntityRepository, Repository } from 'typeorm';

import { ProjectRole } from '@orm/entities/project-role.entity';

@EntityRepository(ProjectRole)
export class ProjectRoleRepository extends Repository<ProjectRole> {
  public findAll(): Promise<ProjectRole[]> {
    return this.find();
  }
}
