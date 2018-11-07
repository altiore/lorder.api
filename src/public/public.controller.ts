import { Controller, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { Project } from '../@orm/project';
import { ProjectService } from '../project/project.service';

@ApiBearerAuth()
@ApiUseTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiResponse({ description: 'Публичные данные проекта', status: 200, type: Project })
  @Get(':projectId')
  public async publicProject(@Param('projectId', ParseIntPipe) projectId: number): Promise<Project> {
    try {
      return await this.projectService.findPublicById(projectId);
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }
}
