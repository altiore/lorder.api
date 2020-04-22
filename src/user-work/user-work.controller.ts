import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Project } from '@orm/project';
import { User } from '@orm/user';
import { ACCESS_LEVEL } from '@orm/user-project';
import { UserWork } from '@orm/user-work';

import { Roles, UserJWT } from '../@common/decorators';
import { PaginationDto } from '../@common/dto/pagination.dto';
import { RolesGuard } from '../@common/guards';
import { AccessLevel, ProjectParam } from '../project/@common/decorators';
import { AccessLevelGuard } from '../project/@common/guards';

import { StartResponse, StopResponse, UserWorkCreateDto, UserWorkEditResultDto, UserWorkPatchDto } from './dto';
import { UserWorkService } from './user-work.service';

@ApiBearerAuth()
@ApiTags('user-works (role: user)')
@Controller('user-works')
@UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard)
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
    @Body() userWorkCreateDto: UserWorkCreateDto,
    @ProjectParam() project: Project,
    @UserJWT() user: User
  ): Promise<StartResponse> {
    return this.userWorkService.start(project, user, userWorkCreateDto);
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
    return this.userWorkService.update(userWork, userWorkDto, user);
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
}
