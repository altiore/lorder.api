import {
  Get,
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

import { User } from '../@entities/user';
import { Project, ProjectDto } from '../@entities/project';
import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiUseTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiResponse({ status: 200, type: Project, isArray: true })
  public all(@UserJWT() user: User): Promise<any> {
    return this.projectService.findAll(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @Roles('owner', 'admin')
  @ApiResponse({ status: 200, type: Project })
  public one(
    @Param('id', ParseIntPipe)
    id: number,
  ): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The Project has been successfully created.',
    type: Project,
  })
  public create(@Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data);
  }
}
