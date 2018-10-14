import { Body, Controller, Delete, Headers, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

import { Roles, UserJWT } from '../../@common/decorators';
import { IdDto } from '../../@common/dto';
import { RolesGuard } from '../../@common/guards';
import { EmailDto, User } from '../../@orm/user';
import { UserProject } from '../../@orm/user-project';
import { ProjectService } from '../project.service';
import { ProjectMemberService } from './project.member.service';

@ApiBearerAuth()
@ApiUseTags('projects -> members (role: user)')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects/:projectId/members')
export class ProjectMemberController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly projectMemberService: ProjectMemberService
  ) {}

  @Post()
  @Roles('admin')
  @ApiResponse({
    description: 'The Invite has been successfully sent.',
    status: 201,
    type: UserProject,
  })
  public async invite(
    @Body() data: EmailDto,
    @Headers('origin') origin: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User
  ): Promise<UserProject> {
    const project = await this.projectService.findOneByMember(projectId, user);
    return this.projectMemberService.invite(project, data, origin, user);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Delete()
  @Roles('admin')
  public async delete(
    @Body() data: IdDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User
  ): Promise<boolean> {
    const project = await this.projectService.findOneByMember(projectId, user);
    return this.projectMemberService.removeMemberFromProject(data, project);
  }
}
