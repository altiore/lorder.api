import { Body, Controller, Get, Headers, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';

import { Roles } from '../@common/decorators/roles.decorator';
import { UserJWT } from '../@common/decorators/user-jwt.decorator';
import { RolesGuard } from '../@common/guards/roles.guard';
import { Project, ProjectDto } from '../@orm/project';
import { EmailDto, User } from '../@orm/user';
import { TaskTypesDto } from './dto/task-types.dto';
import { ProjectService } from './project.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Roles('user')
  @ApiResponse({ status: 200, type: Project, isArray: true })
  @ApiUseTags('projects')
  public async all(@UserJWT() user: User): Promise<Project[]> {
    return this.projectService.findAll(user);
  }

  @Get(':id')
  @Roles('user')
  @ApiResponse({ status: 200, type: Project })
  @ApiUseTags('projects')
  public one(@UserJWT() user: User, @Param('id', ParseIntPipe) id: number): Promise<Project> {
    return this.projectService.findOne(id, user);
  }

  @Post()
  @Roles('user')
  @ApiResponse({
    description: 'The Project has been successfully created.',
    status: 201,
    type: Project,
  })
  @ApiUseTags('projects')
  public create(@UserJWT() user: User, @Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data, user);
  }

  @Put(':id/task-types')
  @Roles('user')
  @ApiResponse({
    description: 'Project task types has been successfully added.',
    status: 200,
    type: Project,
  })
  @ApiUseTags('projects')
  public async update(
    @Body() dto: TaskTypesDto,
    @UserJWT() user: User,
    @Param('id', ParseIntPipe) id: number
  ): Promise<any> {
    const project = await this.projectService.findOne(id, user);
    return this.projectService.update(project, dto.taskTypes);
  }

  // @Post(':id/users')
  // @Roles('admin')
  // @ApiResponse({
  //   status: 201,
  //   description: 'The Invite has been successfully sent.',
  //   type: User,
  // })
  // @ApiUseTags('projects -> users')
  // public async invite(
  //   @Body() data: EmailDto,
  //   @Headers('origin') origin: string,
  //   @Param('id', ParseIntPipe)
  //   id: number,
  //   @UserJWT() user: User,
  // ): Promise<User> {
  //   const project = await this.projectService.findOne(id, user);
  //   return this.projectService.invite(project, data, origin);
  // }
}
