import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { DeleteResult } from 'typeorm';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { RolesGuard } from '../@common/guards/roles.guard';
import { Project, ProjectDto } from '../@orm/project';
import { User } from '../@orm/user';
import { ProjectPaginationDto } from './dto';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@ApiUseTags('projects')
@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiResponse({ status: 200, type: Project, isArray: true })
  @Get()
  @Roles('user')
  public async all(@UserJWT() user: User, @Query() pagesDto: ProjectPaginationDto): Promise<Partial<Project>[]> {
    return this.projectService.findWithPaginationByUser(pagesDto, user);
  }

  @ApiResponse({ status: 200, type: Project })
  @Get(':id')
  @Roles('user')
  public one(@UserJWT() user: User, @Param('id', ParseIntPipe) id: number): Promise<Partial<Project>> {
    return this.projectService.findOne(id, user);
  }

  @ApiResponse({ description: 'Проект успешно создан', status: 201, type: Project })
  @Post()
  @Roles('user')
  public create(@UserJWT() user: User, @Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data, user);
  }

  @ApiResponse({ description: 'Проект успешно удален', status: 201, type: Project })
  @Delete(':id')
  @Roles('user')
  public delete(@UserJWT() user: User, @Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.projectService.remove(id, user);
  }
}
