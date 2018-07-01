import { Get, Controller, UseGuards, Param, ParseIntPipe, Patch, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../@common/guards/roles.guard';
import { Roles } from '../@common/decorators/roles.decorator';
import { Task, TaskCreateDto } from '../@entities/task';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiUseTags('tasks (role: admin)')
@Controller('projects/:projectId/tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Roles('admin')
  @ApiResponse({ status: 200, type: Task, isArray: true })
  public all(
    @Param('projectId', ParseIntPipe)
    projectId: number,
  ): Promise<Task[]> {
    return this.taskService.findAll(projectId);
  }

  @Get(':id')
  @Roles('admin')
  @ApiResponse({ status: 200, type: Task })
  public one(
    @Param('projectId', ParseIntPipe)
    projectId: number,
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.taskService.findOne(id, projectId);
  }

  @Post()
  @Roles('admin')
  @ApiResponse({ status: 201, type: Task })
  public create(
    @Param('projectId', ParseIntPipe)
    projectId: number,
    @Body() taskCreateDto: TaskCreateDto,
  ) {
    return this.taskService.create(taskCreateDto, projectId);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiResponse({ status: 200, type: Task })
  public update(
    @Param('projectId', ParseIntPipe)
    projectId: number,
    @Param('id', ParseIntPipe)
    id: number,
    @Body() taskCreateDto: TaskCreateDto,
  ) {
    return this.taskService.update(id, taskCreateDto, projectId);
  }
}
