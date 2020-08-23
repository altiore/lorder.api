import { Body, Controller, Delete, Get, Headers, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DeepPartial } from 'typeorm';

import { Project } from '@orm/entities/project.entity';
import { ACCESS_LEVEL, UserProject } from '@orm/entities/user-project.entity';
import { User } from '@orm/entities/user.entity';
import { EmailDto } from '@orm/user/dto';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { Roles, UserJWT } from '../../@common/decorators';
import { IdDto } from '../../@common/dto';
import { RolesGuard } from '../../@common/guards';
import { AccessLevel, ProjectParam } from '../@common/decorators';
import { AccessLevelGuard } from '../@common/guards';
import { RequestMembership } from './dto/request.membership';
import { UserProjectUpdateDto } from './dto/user-project.update.dto';
import { ProjectMemberService } from './project.member.service';

@ApiBearerAuth()
@ApiTags('projects -> members (role: user)')
@UseGuards(JwtAuthGuard, RolesGuard, AccessLevelGuard)
@Controller('projects/:projectId/members')
export class ProjectMemberController {
  constructor(private readonly projectMemberService: ProjectMemberService) {}

  @ApiResponse({
    description: 'Список всех пользователей проекта',
    isArray: true,
    status: 200,
    type: UserProject,
  })
  @Get()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.GREEN)
  public async all(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: Project,
    @UserJWT() user: User
  ): Promise<UserProject[]> {
    return this.projectMemberService.getAllByProject(project, user);
  }

  @ApiResponse({
    description: 'The Invite has been successfully sent.',
    status: 201,
    type: UserProject,
  })
  @Post()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.YELLOW)
  public async invite(
    @Body() data: EmailDto,
    @Headers('origin') origin: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<UserProject> {
    return this.projectMemberService.invite(project, data, origin, user);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Delete()
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.VIOLET)
  public async delete(
    @Body() data: IdDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<boolean> {
    return this.projectMemberService.removeMemberFromProject(data, project);
  }

  @ApiResponse({ status: 200, type: UserProject })
  @Patch('accept')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.WHITE)
  public async accept(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: DeepPartial<Project>,
    @UserJWT() user: User
  ): Promise<UserProject> {
    return this.projectMemberService.acceptInvitation(user, project);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Patch(':memberId')
  @Roles('user')
  @AccessLevel(ACCESS_LEVEL.VIOLET)
  public async changeLevel(
    @Body() data: UserProjectUpdateDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: Project,
    @Param('memberId', ParseIntPipe) memberId: number
  ) {
    return this.projectMemberService.updateMember(memberId, project, data);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Post('request')
  @Roles('user')
  public async requestMembership(
    @Body() data: RequestMembership,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User
  ): Promise<UserProject> {
    return this.projectMemberService.requestMembership(user, projectId, data);
  }
}
