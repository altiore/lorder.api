import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { classToClass } from 'class-transformer';
import { In } from 'typeorm';

import { Project } from '@orm/entities/project.entity';
import { User } from '@orm/entities/user.entity';

import { ROLE } from '../../@domains/strategy';
import { ProjectRoleAllowedMove } from '../../@orm/entities/project-role-allowed-move.entity';
import { ProjectRole } from '../../@orm/entities/project-role.entity';
import { RoleService } from '../../role/role.service';
import { ProjectRoleCreateDto, ProjectRoleUpdateDto } from './dto';
import { ProjectRoleRepository } from './project-role.repository';

@Injectable()
export class ProjectRoleService {
  constructor(
    @InjectRepository(ProjectRoleRepository) private readonly repo: ProjectRoleRepository,
    private readonly roleService: RoleService
  ) {}

  public async findAll(project: Project): Promise<ProjectRole[]> {
    return await this.repo.find({
      where: { project: { id: project.id } },
      relations: ['role'],
      loadRelationIds: {
        relations: ['project'],
      },
    });
  }

  public async createOne(projectRoleDto: ProjectRoleCreateDto, project: Project, user: User): Promise<ProjectRole> {
    const role = await this.roleService.getOneById(projectRoleDto.roleId);
    if (!role) {
      throw new NotFoundException('Role Was not found');
    }
    const projectRoleData: Partial<ProjectRole> = {
      project,
      role,
      allowedMoves: projectRoleDto.allowedMoveIds.map((id) => ({ id })) as ProjectRoleAllowedMove[],
      isPublic: projectRoleDto.isPublic,
    };
    const entity = this.repo.create(projectRoleData);
    return classToClass(await this.repo.save(entity));
  }

  public async updateOne(roleId: number, projectRoleDto: ProjectRoleUpdateDto): Promise<ProjectRole> {
    let entity = await this.repo.findOne(roleId);
    if (!entity) {
      throw new NotFoundException('Роль в проекте не была найдена');
    }
    entity = this.repo.merge(entity, projectRoleDto);
    return classToClass(await this.repo.save(entity));
  }

  public async deleteOne(project: Project, user: User, roleId: ROLE) {
    return this.repo.delete({
      project,
      role: { id: roleId },
    });
  }

  public async findByRoles(roles: string[], project: Project): Promise<ProjectRole[]> {
    return await this.repo.find({
      where: { project: { id: project.id }, role: { id: In(roles) } },
      relations: ['role'],
      loadRelationIds: {
        relations: ['project'],
      },
    });
  }
}
