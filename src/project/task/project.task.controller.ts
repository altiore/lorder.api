import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { Roles, UserJWT } from '../../@common/decorators';
import { ListResponseDto, PaginationDto } from '../../@common/dto';
import { RolesGuard } from '../../@common/guards';
import { Project } from '../../@orm/project';
import { Task } from '../../@orm/task';
import { User } from '../../@orm/user';
import { ACCESS_LEVEL } from '../../@orm/user-project';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { TaskCreateDto, TaskMoveDto, TaskUpdateDto } from './dto';
import { ProjectTaskService } from './project.task.service';

@ApiBearerAuth()
@ApiUseTags('projects -> tasks (role: user)')
@Controller('projects/:projectId/tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
@UseInterceptors(CacheInterceptor)
export class ProjectTaskController {
  constructor(private readonly taskService: ProjectTaskService) {}

  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: ListResponseDto, description: 'ACCESS_LEVEL.RED' })
  public all(
    @Query() pagesDto: PaginationDto,
    @Param('projectId', ParseIntPipe) projectId: number
  ): Promise<ListResponseDto<Task>> {
    return this.taskService.findAll(pagesDto, projectId);
  }

  @Get(':sequenceNumber')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: Task, description: 'ACCESS_LEVEL.RED' })
  public async one(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
    @ProjectParam() project: Project
  ): Promise<Task> {
    const task = await this.taskService.findOne(sequenceNumber, projectId);
    if (!task) {
      throw new NotFoundException(
        `Задача ${sequenceNumber} не найдена в проекте "${project.title}"`
      );
    }
    return task;
  }

  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.ORANGE)
  @ApiResponse({ status: 201, type: Task, description: 'ACCESS_LEVEL.ORANGE' })
  public create(
    @Body() taskCreateDto: TaskCreateDto,
    @ProjectParam() project: Project,
    @UserJWT() user: User
  ) {
    return this.taskService.create(taskCreateDto, project, user);
  }

  @Patch(':sequenceNumber')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: Task, description: 'ACCESS_LEVEL.RED' })
  public update(
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
    @ProjectParam() project: Project,
    @UserJWT() user: User,
    @Body() taskCreateDto: TaskUpdateDto
  ) {
    return this.taskService.update(sequenceNumber, taskCreateDto, project, user);
  }

  @Patch(':sequenceNumber/move')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: Task, description: 'Доступно для уровня ACCESS_LEVEL.RED (1)' })
  public async move(
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
    @ProjectParam() project: Project,
    @Body() taskMoveDto: TaskMoveDto,
    @UserJWT() user: User
  ) {
    return this.taskService.move(sequenceNumber, project, user, taskMoveDto);
  }

  @Delete(':sequenceNumber')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.GREEN)
  @ApiResponse({
    description: 'Доступно для уровня ACCESS_LEVEL.GREEN (4)',
    status: 200,
    type: Task,
  })
  public async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
    @ProjectParam() project: DeepPartial<Project>
  ) {
    const task = await this.taskService.delete(sequenceNumber, projectId);
    if (!task) {
      throw new NotFoundException(
        `Задача ${sequenceNumber} не была найдена в проекте ${project.title}`
      );
    }
    return task;
  }
}
