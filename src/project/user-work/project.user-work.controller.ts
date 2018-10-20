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
import { DeepPartial } from 'typeorm';

import { Roles, UserJWT } from '../../@common/decorators';
import { RolesGuard } from '../../@common/guards';
import { Project } from '../../@orm/project';
import { User } from '../../@orm/user';
import { ACCESS_LEVEL } from '../../@orm/user-project';
import { UserWork } from '../../@orm/user-work';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { UserWorkCreateDto } from './dto';
import { ProjectUserWorkService } from './project.user-work.service';

@ApiBearerAuth()
@ApiUseTags('projects -> user-works (role: user)')
@Controller('projects/:projectId/user-works')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
export class ProjectUserWorkController {
  constructor(private readonly userWorkService: ProjectUserWorkService) {}

  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserWork, isArray: true, description: 'ACCESS_LEVEL.RED' })
  public all(@Param('projectId', ParseIntPipe) projectId: number, @UserJWT() user: User): Promise<UserWork[]> {
    return this.userWorkService.findAll(user);
  }

  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 201, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public start(
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @Body() userWorkCreateDto: UserWorkCreateDto
  ): Promise<UserWork> {
    return this.userWorkService.start(project, user, userWorkCreateDto);
  }

  @Patch(':userWorkId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public stop(
    @UserJWT() user: User,
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userWorkId', ParseIntPipe) userWorkId: number,
    @ProjectParam() project: DeepPartial<Project>
  ): Promise<UserWork> {
    return this.userWorkService.stop(project, user, userWorkId);
  }

  @Delete(':userWorkId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async delete(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('userWorkId', ParseIntPipe) userWorkId: number,
    @UserJWT() user: User
  ): Promise<UserWork> {
    const task = await this.userWorkService.remove(userWorkId, user);
    if (!task) {
      throw new NotFoundException('Задача не найдена');
    }
    return task;
  }
}
