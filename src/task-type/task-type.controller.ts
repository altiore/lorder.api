import { Get, Controller, Post, Body, Patch, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

import { RolesGuard } from '../@common/guards/roles.guard';
import { TaskType, TaskTypeCreateDto } from '../@orm/task-type';
import { Roles } from '../@common/decorators/roles.decorator';
import { TaskTypeService } from './task-type.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiUseTags('task-types')
@Controller('task-types')
export class TaskTypeController {
  constructor(private readonly tasktypeService: TaskTypeService) {}

  @Get()
  @Roles('super-admin')
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
  public update(
    @Param('id', ParseIntPipe)
    id: number,
    @Body() taskTypeCreateDto: TaskTypeCreateDto,
  ) {
    return this.tasktypeService.update(id, taskTypeCreateDto);
  }

  @Delete(':id')
  @Roles('super-admin')
  @ApiResponse({ status: 200 })
  public remove(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.tasktypeService.remove(id);
  }
}
