import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { TaskType, TaskTypeCreateDto } from '../@orm/task-type';

import { TaskTypeService } from './task-type.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('task-types (roles: user(get), super-admin(create/edit/delete))')
@Controller('task-types')
export class TaskTypeController {
  constructor(private readonly tasktypeService: TaskTypeService) {}

  // TODO: простому пользователю нужны только типы задач, которые есть в проектах пользователя (все не нужны)
  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: TaskType, isArray: true })
  public all() {
    return this.tasktypeService.findAll();
  }

  @Post()
  @Roles('super-admin')
  @ApiResponse({
    status: 201,
    type: TaskType,
  })
  public create(@Body() taskTypeCreateDto: TaskTypeCreateDto) {
    return this.tasktypeService.create(taskTypeCreateDto);
  }

  @Patch(':id')
  @Roles('super-admin')
  @ApiResponse({
    status: 200,
    type: TaskType,
  })
  public update(@Param('id', ParseIntPipe) id: number, @Body() taskTypeCreateDto: TaskTypeCreateDto) {
    return this.tasktypeService.update(id, taskTypeCreateDto);
  }

  @Delete(':id')
  @Roles('super-admin')
  @ApiResponse({ status: 200 })
  public remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasktypeService.remove(id);
  }
}
