import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Roles, UserJWT } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { Task } from '../@orm/task';
import { User } from '../@orm/user';
import { TaskPagination } from './dto';
import { TaskService } from './task.service';

@ApiBearerAuth()
@ApiUseTags('tasks (role: user)')
@Controller('tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: Task, isArray: true })
  public all(@Query() pagesDto: TaskPagination, @UserJWT() user: User): Promise<Task[]> {
    return this.taskService.findAll(pagesDto, user);
  }
}
