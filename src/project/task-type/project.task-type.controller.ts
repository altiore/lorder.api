import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DeepPartial, DeleteResult } from 'typeorm';

import { Project } from '@orm/project';
import { ProjectTaskType } from '@orm/project-task-type';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { Roles, UserJWT } from '../../@common/decorators';
import { RolesGuard } from '../../@common/guards';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { TaskTypeDto, TaskTypesDto } from './dto';
import { ProjectTaskTypeService } from './project.task-type.service';

@ApiBearerAuth()
@ApiTags('projects -> task-types (role: user)')
@UseGuards(JwtAuthGuard, RolesGuard, AccessLevelGuard)
@Controller('projects/:projectId/task-types')
export class ProjectTaskTypeController {
  constructor(private readonly projectTaskTypeService: ProjectTaskTypeService) {}

  @ApiResponse({
    description: 'All project task types',
    isArray: true,
    status: 200,
    type: ProjectTaskType,
  })
  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  public async get(
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>
  ): Promise<ProjectTaskType[]> {
    return this.projectTaskTypeService.all(project);
  }

  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: ProjectTaskType,
  })
  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.BLUE)
  public async addTaskTypeToProject(
    @Body() dto: TaskTypeDto,
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>
  ): Promise<ProjectTaskType> {
    return this.projectTaskTypeService.addTaskType(project, dto.taskTypeId);
  }

  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: Project,
  })
  @Put()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.BLUE)
  public async update(
    @Body() dto: TaskTypesDto,
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>
  ): Promise<ProjectTaskType> {
    return this.projectTaskTypeService.update(project, dto.taskTypes);
  }

  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: DeleteResult,
  })
  @Delete()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.BLUE)
  public async removeFromProject(
    @Body() dto: TaskTypeDto,
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>
  ): Promise<any> {
    return this.projectTaskTypeService.removeFromProject(project, dto.taskTypeId);
  }
}
