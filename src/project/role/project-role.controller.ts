import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

import { Roles, UserJWT } from '../../@common/decorators';
import { ListDto } from '../../@common/dto';
import { RolesGuard } from '../../@common/guards';
import { Project } from '../../@orm/project';
import { ProjectRole } from '../../@orm/project-role';
import { TaskLog } from '../../@orm/task-log';
import { User } from '../../@orm/user';
import { ACCESS_LEVEL } from '../../@orm/user-project';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { ProjectRoleCreateDto } from './dto';
import { ProjectRoleService } from './project-role.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
@ApiUseTags('projects -> project-role (role: user)')
@Controller('projects/:projectId/roles')
export class ProjectRoleController {
  constructor(private readonly projectRoleService: ProjectRoleService) {}

  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: TaskLog, isArray: true })
  public all(
    @Param('taskId') taskId: number,
    @ProjectParam() project: Project,
    @Query() pagesDto: ListDto,
    @UserJWT() user: User
  ) {
    return this.projectRoleService.findAll(project, taskId, pagesDto, user);
  }

  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.INDIGO)
  @ApiResponse({ status: 201, type: ProjectRole })
  public createOne(
    @ProjectParam() project: Project,
    @Body() projectRoleDto: ProjectRoleCreateDto,
    @UserJWT() user: User
  ): Promise<ProjectRole> {
    return this.projectRoleService.createOne(projectRoleDto, project, user);
  }
}
