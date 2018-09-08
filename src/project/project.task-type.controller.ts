import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { DeleteResult } from 'typeorm';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { RolesGuard } from '../@common/guards/roles.guard';
import { Project } from '../@orm/project';
import { ProjectTaskType } from '../@orm/project-task-type';
import { User } from '../@orm/user';
import { TaskTypeDto, TaskTypesDto } from './dto';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@ApiUseTags('projects -> task-types')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects/:id/task-types')
export class ProjectTaskTypeController {
  constructor(private readonly projectService: ProjectService) {}

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
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    const project = await this.projectService.findOne(id, user);
    return this.projectService.addTaskType(project, dto.taskTypeId);
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
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    const project = await this.projectService.findOne(id, user);
    return this.projectService.update(project, dto.taskTypes);
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
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    const project = await this.projectService.findOne(id, user);
    return this.projectService.removeFromProject(project, dto.taskTypeId);
  }
}
