import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Project } from '@orm/project';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';
import { UserWork } from '@orm/user-work';

import { PaginationDto } from '@common/dto';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { Auth, res, Roles, UserJWT } from '../@common/decorators';
import { RolesGuard } from '../@common/guards';
import { ROLES } from '../@orm/role';
import { Task } from '../@orm/task';
import { AccessLevel, ProjectParam } from '../project/@common/decorators';
import { AccessLevelGuard } from '../project/@common/guards';
import {
  CreateAndStartDto,
  RevertBackDto,
  StartResponse,
  StopResponse,
  UserWorkEditResultDto,
  UserWorkPatchDto,
  UserWorkStartDto,
} from './dto';
import { UserWorkService } from './user-work.service';

@ApiBearerAuth()
@ApiTags('user-works (role: user)')
@Controller('user-works')
@UseGuards(JwtAuthGuard, RolesGuard, AccessLevelGuard)
export class UserWorkController {
  constructor(private readonly userWorkService: UserWorkService) {}

  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, isArray: true })
  public all(@Query() pagesDto: PaginationDto, @UserJWT() user: User): Promise<UserWork[]> {
    return this.userWorkService.findAll(pagesDto, user);
  }

  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 201, type: StartResponse, description: 'ACCESS_LEVEL.RED' })
  public start(
    @Body() userWorkCreateDto: UserWorkStartDto,
    @ProjectParam() project: Project,
    @UserJWT() user: User
  ): Promise<StartResponse> {
    return this.userWorkService.start(project, user, userWorkCreateDto);
  }

  @Post('create-and-start')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 201, type: StartResponse, description: 'ACCESS_LEVEL.RED' })
  public createAndStart(
    @Body() createAndStartDto: CreateAndStartDto,
    @ProjectParam() project: Project,
    @UserJWT() user: User
  ): Promise<StartResponse> {
    return this.userWorkService.createAndStart(project, user);
  }

  @Patch(':userWorkId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async update(
    @Body() userWorkDto: UserWorkPatchDto,
    @Param('userWorkId', ParseIntPipe) userWorkId: number,
    @ProjectParam() project: Project, // projectId from Body
    @UserJWT() user: User
  ): Promise<UserWorkEditResultDto> {
    const userWork = await this.userWorkService.findOneByUser(userWorkId, user);
    return await this.userWorkService.update(userWork, userWorkDto, user);
  }

  @Patch(':userWorkId/stop')
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async stop(
    @Param('userWorkId', ParseIntPipe) userWorkId: number,
    @UserJWT() user: User
  ): Promise<StopResponse> {
    const userWork = await this.userWorkService.findOneByUserAndCheckAccess(userWorkId, user);
    return this.userWorkService.stop(userWork, user);
  }

  @Patch(':userWorkId/pause')
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async pause(
    @Param('userWorkId', ParseIntPipe) userWorkId: number,
    @UserJWT() user: User
  ): Promise<StopResponse> {
    const userWork = await this.userWorkService.findOneByUserAndCheckAccess(userWorkId, user);
    return this.userWorkService.pause(userWork, user);
  }

  @Patch(':sequenceNumber/:projectId/bring-back')
  @Auth(res(Project).updateOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public async revertBack(
    @Param('sequenceNumber', ParseIntPipe) sequenceNumber: number,
    @Body() revertBackDto: RevertBackDto,
    @ProjectParam() project: Project,
    @UserJWT() user: User
  ): Promise<{ task: Task; stopResponse: StopResponse }> {
    return this.userWorkService.revertBack(sequenceNumber, project, user, revertBackDto);
  }

  @Delete(':userWorkId')
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async delete(@Param('userWorkId', ParseIntPipe) userWorkId: number, @UserJWT() user: User): Promise<UserWork> {
    const userWork = await this.userWorkService.findOneByUserAndCheckAccess(userWorkId, user);
    await this.userWorkService.remove(userWork, user);
    return userWork;
  }

  @Get('recent')
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, isArray: true })
  public recent(@Query() pagesDto: PaginationDto, @UserJWT() user: User): Promise<UserWork[]> {
    return this.userWorkService.recent(user, pagesDto);
  }

  @Get('project/:projectId/task/:sequenceNumber')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.RED)
  @ApiResponse({ status: 200, type: UserWork, isArray: true })
  public taskUserWorks(
    @Param('sequenceNumber') sequenceNumber: number,
    @ProjectParam() project: Project,
    @Query() pagesDto: PaginationDto,
    @UserJWT() user: User
  ): Promise<UserWork[]> {
    return this.userWorkService.findAllByTaskSequenceNumber(project, user, sequenceNumber, pagesDto);
  }
}
