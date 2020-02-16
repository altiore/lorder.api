import { EntityRepository, Repository } from 'typeorm';

import { ProjectRole } from './project-role.entity';

@EntityRepository(ProjectRole)
export class ProjectRoleRepository extends Repository<ProjectRole> {
  public findAll(): Promise<ProjectRole[]> {
    return this.find();
  }
}
