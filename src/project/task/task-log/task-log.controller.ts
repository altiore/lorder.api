import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { Project } from '@orm/project';
import { TaskLog } from '@orm/task-log';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';

import { Roles, UserJWT } from '../../../@common/decorators';
import { ListDto } from '../../../@common/dto';
import { RolesGuard } from '../../../@common/guards';
import { AccessLevel, ProjectParam } from '../../@common/decorators';
import { AccessLevelGuard } from '../../@common/guards';

import { TaskLogService } from './task-log.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard, AccessLevelGuard)
@ApiTags('projects -> tasks -> task-logs (role: user)')
@Controller('projects/:projectId/tasks/:sequenceNumber/task-logs')
export class TaskLogController {
  constructor(private readonly taskLogService: TaskLogService) {}

  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: TaskLog, isArray: true })
  public all(
    @Param('sequenceNumber') sequenceNumber: number,
    @ProjectParam() project: Project,
    @Query() pagesDto: ListDto,
    @UserJWT() user: User
  ) {
    return this.taskLogService.findAll(project, sequenceNumber, pagesDto, user);
  }
}
