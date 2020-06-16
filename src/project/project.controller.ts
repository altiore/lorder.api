import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Project, ProjectDto } from '@orm/project';
import { ROLES } from '@orm/role';
import { User } from '@orm/user';
import { ACCESS_LEVEL, UserProject } from '@orm/user-project';

import { Auth, res, UserJWT } from '@common/decorators';

import { ProjectParam } from './@common/decorators';
import { ProjectPaginationDto } from './@dto';
import { ProjectService } from './project.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Auth(res(Project).getMany, ROLES.USER)
  public async allOwn(@UserJWT() user: User, @Query() pagesDto: ProjectPaginationDto): Promise<UserProject[]> {
    return this.projectService.findAllParticipantByUser(pagesDto, user);
  }

  @Get('all')
  @Auth(res(Project).getMany, ROLES.SUPER_ADMIN)
  public async all(@UserJWT() user: User, @Query() pagesDto: ProjectPaginationDto): Promise<Project[]> {
    return this.projectService.findAllBySuperAdmin(pagesDto);
  }

  @Get(':projectId')
  @Auth(res(Project).getOne, ROLES.USER, ACCESS_LEVEL.RED)
  public one(@ProjectParam() project: Project, @UserJWT() user: User): Promise<Project> {
    return this.projectService.findProjectDetails(project, user);
  }

  @Post()
  @Auth(res(Project).createOne, ROLES.USER)
  public create(@UserJWT() user: User, @Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data, user);
  }

  @Patch(':projectId')
  @Auth(res(Project).updateOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public update(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: Project,
    @UserJWT() user: User,
    @Body() data: ProjectDto
  ): Promise<Project> {
    return this.projectService.update(project, data, user);
  }

  @Delete(':projectId')
  @Auth(res(Project).deleteOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public delete(
    @Param('projectId', ParseIntPipe) projectId: number // must be here because of swagger
  ): Promise<number> {
    return this.projectService.remove(projectId);
  }

  @Delete(':projectId/admin')
  @Auth(res(Project, 'Возвращает id удаленного проекта').deleteOne, ROLES.SUPER_ADMIN)
  public adminDelete(
    @Param('projectId', ParseIntPipe) projectId: number // must be here because of swagger
  ): Promise<number> {
    return this.projectService.remove(projectId, true);
  }

  @Post(':projectId/publish')
  @Auth(res(Project, 'Опубликовать проект').c, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public publish(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: Project
  ): Promise<Project> {
    return this.projectService.publish(project);
  }

  @Patch(':projectId/statistic')
  @Auth(res(Project, 'Обновить статистику проекта').c, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public async statistic(@ProjectParam() project: Project): Promise<UserProject[]> {
    return this.projectService.updateStatistic(project);
  }
}
