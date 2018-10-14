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

import { Roles } from '../../@common/decorators';
import { RolesGuard } from '../../@common/guards';
import { Task } from '../../@orm/task';
import { ACCESS_LEVEL } from '../../@orm/user-project';
import { AccessLevel } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { TaskCreateDto } from './dto';
import { ProjectTaskService } from './project.task.service';

@ApiBearerAuth()
@ApiUseTags('projects -> tasks (role: user)')
@Controller('projects/:projectId/tasks')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
export class ProjectTaskController {
  constructor(private readonly taskService: ProjectTaskService) {}

  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: Task, isArray: true, description: 'ACCESS_LEVEL.RED' })
  public all(@Param('projectId', ParseIntPipe) projectId: number): Promise<Task[]> {
    return this.taskService.findAll(projectId);
  }

  @Get(':id')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: Task, description: 'ACCESS_LEVEL.RED' })
  public one(@Param('projectId', ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) id: number) {
    return this.taskService.findOne(id, projectId);
  }

  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.ORANGE)
  @ApiResponse({ status: 201, type: Task, description: 'ACCESS_LEVEL.ORANGE' })
  public create(@Param('projectId', ParseIntPipe) projectId: number, @Body() taskCreateDto: TaskCreateDto) {
    return this.taskService.create(taskCreateDto, projectId);
  }

  @Patch(':id')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.YELLOW)
  @ApiResponse({ status: 200, type: Task, description: 'ACCESS_LEVEL.YELLOW' })
  public update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() taskCreateDto: TaskCreateDto
  ) {
    return this.taskService.update(id, taskCreateDto, projectId);
  }

  @Delete(':id')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.GREEN)
  @ApiResponse({ status: 200, type: Task, description: 'Доступно для уровня ACCESS_LEVEL.GREEN (4)' })
  public async delete(@Param('projectId', ParseIntPipe) projectId: number, @Param('id', ParseIntPipe) id: number) {
    const task = await this.taskService.delete(id, projectId);
    if (!task) {
      throw new NotFoundException('Задача для удаления не была найдена');
    }
    return task;
  }
}
