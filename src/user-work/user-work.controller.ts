import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { DeepPartial } from 'typeorm';

import { Roles, UserJWT } from '../@common/decorators';
import { PaginationDto } from '../@common/dto/pagination.dto';
import { RolesGuard } from '../@common/guards';
import { Project } from '../@orm/project';
import { User } from '../@orm/user';
import { ACCESS_LEVEL } from '../@orm/user-project';
import { UserWork } from '../@orm/user-work';
import { AccessLevel, ProjectParam } from '../project/@common/decorators';
import { AccessLevelGuard } from '../project/@common/guards';
import { UserWorkCreateDto } from './dto';
import { UserWorkService } from './user-work.service';

@ApiBearerAuth()
@ApiUseTags('user-works (role: user)')
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
  @ApiResponse({ status: 201, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public start(
    @Body() userWorkCreateDto: UserWorkCreateDto,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<UserWork> {
    return this.userWorkService.start(project, user, userWorkCreateDto);
  }

  @Patch(':userWorkId')
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async stop(@Param('userWorkId', ParseIntPipe) userWorkId: number, @UserJWT() user: User): Promise<UserWork> {
    const userWork = await this.userWorkService.findOneByUserAndCheckAccess(userWorkId, user);
    return this.userWorkService.stop(userWork);
  }

  @Delete(':userWorkId')
  @Roles('user')
  @ApiResponse({ status: 200, type: UserWork, description: 'ACCESS_LEVEL.RED' })
  public async delete(@Param('userWorkId', ParseIntPipe) userWorkId: number, @UserJWT() user: User): Promise<UserWork> {
    const userWork = await this.userWorkService.findOneByUserAndCheckAccess(userWorkId, user);
    return await this.userWorkService.remove(userWork);
  }
}
