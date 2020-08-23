import { Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Task } from '@orm/entities/task.entity';
import { User } from '@orm/entities/user.entity';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { Roles, UserJWT } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { TaskPagination } from './dto';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiTags('tasks (role: user)')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: Task, isArray: true })
  public all(@Query() pagesDto: TaskPagination, @UserJWT() user: User): Promise<Task[]> {
    return this.taskService.findAll(pagesDto, user);
  }

  @Patch(':taskId/archive')
  @Roles('user')
  @ApiResponse({ status: 200, type: Task, description: 'ACCESS_LEVEL.RED' })
  public async archive(@Param('taskId', ParseIntPipe) taskId: number, @UserJWT() user: User): Promise<Task> {
    const task = await this.taskService.archive(taskId, user);

    if (!task) {
      throw new NotFoundException(`Задача ${taskId} не была найдена`);
    }

    return task;
  }
}
