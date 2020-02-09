import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Project } from '@orm/project';
import { ProjectRole, ProjectRoleRepository } from '@orm/project-role';
import { User } from '@orm/user';

import { RoleService } from '../../role/role.service';

import { ProjectRoleCreateDto } from './dto';

@Injectable()
export class ProjectRoleService {
  constructor(
    @InjectRepository(ProjectRoleRepository) private readonly repo: ProjectRoleRepository,
    private readonly roleService: RoleService
  ) {}

  public async findAll(project: Project): Promise<ProjectRole[]> {
    return await this.repo.find({ where: { project }, loadRelationIds: true });
  }

  public async createOne(projectRoleDto: ProjectRoleCreateDto, project: Project, user: User): Promise<ProjectRole> {
    const role = await this.roleService.getOneById(projectRoleDto.roleId);
    if (!role) {
      throw new NotFoundException('Role Was not found');
    }
    const projectRoleData: Partial<ProjectRole> = {
      project,
      role,
      // TODO: привязать workFlow к роли глобально. Это будет проще
      workFlow: {},
    };
    const entity = this.repo.create(projectRoleData);
    return await this.repo.save(entity);
  }

  public async deleteOne(project: Project, user: User, roleId: string) {
    return this.repo.delete({
      project,
      role: { id: roleId },
    });
  }
}
