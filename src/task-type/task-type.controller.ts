import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { TaskType, TaskTypeCreateDto } from '@orm/task-type';
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
