import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

import { Roles, UserJWT } from '../../../@common/decorators';
import { ListDto } from '../../../@common/dto';
import { RolesGuard } from '../../../@common/guards';
import { Project } from '../../../@orm/project';
import { TaskLog } from '../../../@orm/task-log';
import { User } from '../../../@orm/user';
import { ACCESS_LEVEL } from '../../../@orm/user-project';
import { AccessLevel, ProjectParam } from '../../@common/decorators';
import { AccessLevelGuard } from '../../@common/guards';
import { TaskLogService } from './task-log.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
@ApiUseTags('projects -> tasks -> task-logs (role: user)')
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
