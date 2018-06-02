import { Get, Controller, Post, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

import { RolesGuard } from '../@common/guards/roles.guard';
import { User } from '../@entities/user';
import { Project, ProjectDto } from '../@entities/project';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiUseTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: Project, isArray: true })
  public async all(@UserJWT() user: User): Promise<Project[]> {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  @Roles('user')
  @ApiResponse({ status: 200, type: Project })
  public one(@UserJWT() user: User, @Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectService.findOne(id, user);
  }

  @Post()
  @Roles('user')
  @ApiResponse({ status: 201, description: 'The Project has been successfully created.', type: Project })
  public create(@UserJWT() user: User, @Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data, user);
  }
}
