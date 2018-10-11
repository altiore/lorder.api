import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { DeleteResult } from 'typeorm';

import { Roles } from '../../@common/decorators/roles.decorator';
import { UserJWT } from '../../@common/decorators/user-jwt.decorator';
import { RolesGuard } from '../../@common/guards/roles.guard';
import { Project } from '../../@orm/project';
import { ProjectTaskType } from '../../@orm/project-task-type';
import { User } from '../../@orm/user';
import { ProjectService } from '../project.service';
import { TaskTypeDto, TaskTypesDto } from './dto';
import { ProjectTaskTypeService } from './project.task-type.service';

@ApiBearerAuth()
@ApiUseTags('projects -> task-types (role: user)')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects/:projectId/task-types')
export class ProjectTaskTypeController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectTaskTypeService: ProjectTaskTypeService
  ) {}

  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: ProjectTaskType,
  })
  @Post()
  @Roles('user')
  public async addTaskTypeToProject(
    @Body() dto: TaskTypeDto,
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<any> {
    const project = await this.projectService.findOneByMember(projectId, user);
    return this.projectTaskTypeService.addTaskType(project, dto.taskTypeId);
  }

  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: Project,
  })
  @Put()
  @Roles('user')
  public async update(
    @Body() dto: TaskTypesDto,
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<any> {
    const project = await this.projectService.findOneByMember(projectId, user);
    return this.projectTaskTypeService.update(project, dto.taskTypes);
  }

  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: DeleteResult,
  })
  @Delete()
  @Roles('user')
  public async removeFromProject(
    @Body() dto: TaskTypeDto,
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<any> {
    const project = await this.projectService.findOneByMember(projectId, user);
    return this.projectTaskTypeService.removeFromProject(project, dto.taskTypeId);
  }
}
