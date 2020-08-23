import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DeepPartial, DeleteResult } from 'typeorm';

import { ProjectRole } from '@orm/entities/project-role.entity';
import { Project } from '@orm/entities/project.entity';
import { ROLES } from '@orm/entities/role.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';
import { User } from '@orm/entities/user.entity';

import { Auth, res, UserJWT } from '@common/decorators';

import { ROLE } from '../../@domains/strategy';
import { ProjectParam } from '../@common/decorators';
import { ProjectRoleCreateDto, ProjectRoleUpdateDto } from './dto';
import { ProjectRoleService } from './project-role.service';

@ApiTags('projects -> roles (role: user)')
@Controller('projects/:projectId/roles')
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @Get()
  @Auth(res(ProjectRole).getMany, ROLES.USER, ACCESS_LEVEL.RED)
  public all(
    @ProjectParam() project: Project,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User
  ): Promise<ProjectRole[]> {
    return this.projectRoleService.findAll(project);
  }

  @Post()
  @Auth(res(ProjectRole).createOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public async createOne(
    @ProjectParam() project: Project,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() projectRoleDto: ProjectRoleCreateDto,
    @UserJWT() user: User
  ): Promise<DeepPartial<ProjectRole>> {
    return await this.projectRoleService.createOne(projectRoleDto, project, user);
  }

  @Patch(':roleId')
  @Auth(res(ProjectRole).updateOne, ROLES.USER, ACCESS_LEVEL.BLUE)
  public async updateOne(
    @ProjectParam() project: Project,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() projectRoleDto: ProjectRoleUpdateDto,
    @UserJWT() user: User
  ): Promise<DeepPartial<ProjectRole>> {
    return await this.projectRoleService.updateOne(roleId, projectRoleDto);
  }

  @Delete(':roleId')
  @Auth(res(ProjectRole).deleteOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public deleteOne(
    @ProjectParam() project: Project,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User,
    @Param('roleId') roleId: ROLE
  ): Promise<DeleteResult> {
    return this.projectRoleService.deleteOne(project, user, roleId);
  }
}
