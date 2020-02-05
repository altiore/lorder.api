import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '@orm/project';
import { ProjectRole, ProjectRoleRepository } from '@orm/project-role';
import { Role } from '@orm/role';
import { User } from '@orm/user';

import { ProjectRoleCreateDto } from './dto';

@Injectable()
export class ProjectRoleService {
  constructor(@InjectRepository(ProjectRoleRepository) private readonly repo: ProjectRoleRepository) {}

  public async findAll(project: Project): Promise<ProjectRole[]> {
    return await this.repo.find({ where: { project }, loadRelationIds: true });
  }

  public async createOne(projectRoleDto: ProjectRoleCreateDto, project: Project, user: User): Promise<ProjectRole> {
    const projectRoleData: Partial<ProjectRole> = {
      project,
      role: { id: projectRoleDto.roleId } as Role,
      workFlow: projectRoleDto.workFlow,
    };
    const entity = this.repo.create(projectRoleData);
    return await this.repo.save(entity);
  }

  public async deleteOne(project: Project, user: User, roleId: number) {
    return this.repo.delete({
      project,
      role: { id: roleId },
    });
  }
}
