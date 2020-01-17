import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth, r, UserJWT } from '../@common/decorators';
import { Project, ProjectDto } from '../@orm/project';
import { ROLES } from '../@orm/role';
import { User } from '../@orm/user';
import { ACCESS_LEVEL, UserProject } from '../@orm/user-project';
import { ProjectParam } from './@common/decorators';
import { ProjectPaginationDto } from './@dto';
import { ProjectService } from './project.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @Auth(r(Project).getMany, ROLES.USER)
  public async allOwn(
    @UserJWT() user: User,
    @Query() pagesDto: ProjectPaginationDto
  ): Promise<UserProject[]> {
    return this.projectService.findAllParticipantByUser(pagesDto, user);
  }

  @Get('all')
  @Auth(r(Project).getMany, ROLES.SUPER_ADMIN)
  public async all(
    @UserJWT() user: User,
    @Query() pagesDto: ProjectPaginationDto
  ): Promise<Project[]> {
    return this.projectService.findAllBySuperAdmin(pagesDto);
  }

  @Get(':projectId')
  @Auth(r(Project).getOne, ROLES.USER, ACCESS_LEVEL.RED)
  public one(@ProjectParam() project: Project): Partial<Project> {
    return project;
  }

  @Post()
  @Auth(r(Project).createOne, ROLES.USER)
  public create(@UserJWT() user: User, @Body() data: ProjectDto): Promise<Project> {
    return this.projectService.create(data, user);
  }

  @Delete(':projectId')
  @Auth(r(Project).deleteOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public delete(
    @Param('projectId', ParseIntPipe) projectId: number // must be here because of swagger
  ): Promise<number> {
    return this.projectService.remove(projectId);
  }

  @Delete(':projectId/admin')
  @Auth(r(Project, 'Возвращает id удаленного проекта').deleteOne, ROLES.SUPER_ADMIN)
  public adminDelete(
    @Param('projectId', ParseIntPipe) projectId: number // must be here because of swagger
  ): Promise<number> {
    return this.projectService.remove(projectId, true);
  }

  @Post(':projectId/publish')
  @Auth(r(Project, 'Опубликовать проект').c, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public publish(
    @Param('projectId', ParseIntPipe) projectId: number,
    @ProjectParam() project: Project
  ): Promise<Project> {
    return this.projectService.publish(project);
  }

  @Patch(':projectId/statistic')
  @Auth(r(Project, 'Обновить статистику проекта').c, ROLES.USER, ACCESS_LEVEL.VIOLET)
  public async statistic(@ProjectParam() project: Project): Promise<Project> {
    return this.projectService.updateStatistic(project);
  }
}
