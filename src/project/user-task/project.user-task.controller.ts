import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { Roles, UserJWT } from '../../@common/decorators';
import { RolesGuard } from '../../@common/guards';
import { Project } from '../../@orm/project';
import { User } from '../../@orm/user';
import { ACCESS_LEVEL } from '../../@orm/user-project';
import { UserTask } from '../../@orm/user-task';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { UserTaskCreateDto } from './dto';
import { ProjectUserTaskService } from './project.user-task.service';

@ApiBearerAuth()
@ApiUseTags('projects -> user-tasks (role: user)')
@Controller('projects/:projectId/user-tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
export class ProjectUserTaskController {
  constructor(private readonly userTaskService: ProjectUserTaskService) {}

  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserTask, isArray: true, description: 'ACCESS_LEVEL.RED' })
  public all(@Param('projectId', ParseIntPipe) projectId: number, @UserJWT() user: User): Promise<UserTask[]> {
    return this.userTaskService.findAll(user);
  }

  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 201, type: UserTask, description: 'ACCESS_LEVEL.RED' })
  public start(
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @Body() userTaskCreateDto: UserTaskCreateDto
  ): Promise<UserTask> {
    return this.userTaskService.start(project, user, userTaskCreateDto);
  }

  @Patch(':userTaskId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserTask, description: 'ACCESS_LEVEL.RED' })
  public stop(
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userTaskId', ParseIntPipe) userTaskId: number,
    @ProjectParam() project: DeepPartial<Project>
  ): Promise<UserTask> {
    return this.userTaskService.stop(project, user, userTaskId);
  }

  @Delete(':userTaskId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserTask, description: 'ACCESS_LEVEL.RED' })
  public async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userTaskId', ParseIntPipe) userTaskId: number,
    @UserJWT() user: User
  ): Promise<UserTask> {
    const task = await this.userTaskService.remove(userTaskId, user);
    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }
    return task;
  }
}
