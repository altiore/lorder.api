import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ListDto } from '../../@common/dto';
import { Project } from '../../@orm/project';
import { ProjectRole, ProjectRoleRepository } from '../../@orm/project-role';
import { Role } from '../../@orm/role';
import { User } from '../../@orm/user';
import { ProjectTaskService } from '../task/project.task.service';
import { ProjectRoleCreateDto } from './dto';

@Injectable()
export class ProjectRoleService {
  constructor(
    @InjectRepository(ProjectRoleRepository)
    private readonly projectRoleRepo: ProjectRoleRepository,
    private readonly projectTaskService: ProjectTaskService
  ) {}

  public async findAll(
    project: Project,
    taskId: number,
    listDto: ListDto,
    user: User
  ): Promise<ProjectRole[]> {
    const checkedTask = await this.projectTaskService.checkAccess(taskId, project, user);
    return [];
  }

  public async createOne(
    projectRoleDto: ProjectRoleCreateDto,
    project: Project,
    user: User
  ): Promise<ProjectRole> {
    const projectRoleData: Partial<ProjectRole> = {
      project,
      role: { id: projectRoleDto.roleId } as Role,
      workFlow: projectRoleDto.workFlow,
    };
    const entity = this.projectRoleRepo.create(projectRoleData);
    return await this.projectRoleRepo.save(entity);
  }
}
