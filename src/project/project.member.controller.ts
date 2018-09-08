import { Body, Controller, Delete, Headers, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { RolesGuard } from '../@common/guards/roles.guard';
import { EmailDto, IdDto, User } from '../@orm/user';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@ApiUseTags('projects -> members')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects/:projectId/members')
export class ProjectMemberController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles('admin')
  @ApiResponse({
    description: 'The Invite has been successfully sent.',
    status: 201,
    type: User,
  })
  public async invite(
    @Body() data: EmailDto,
    @Headers('origin') origin: string,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User
  ): Promise<User> {
    const project = await this.projectService.findOne(projectId, user);
    return this.projectService.invite(project, data, origin, user);
  }

  @ApiResponse({ status: 200, type: Boolean })
  @Delete()
  @Roles('admin')
  public async delete(
    @Body() data: IdDto,
    @Param('projectId', ParseIntPipe) projectId: number,
    @UserJWT() user: User
  ): Promise<boolean> {
    const project = await this.projectService.findOne(projectId, user);
    return this.projectService.removeMemberFromProject(data, project);
  }
}
