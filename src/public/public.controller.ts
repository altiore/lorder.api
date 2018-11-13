import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { ProjectPub } from '../@orm/project-pub';
import { ProjectService } from '../project/project.service';

@ApiBearerAuth()
@ApiUseTags('public')
@Controller('public')
export class PublicController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiResponse({ description: 'Публичные данные проекта', status: 200, type: ProjectPub })
  @Get(':uuid')
  public async publicProject(@Param('uuid') uuid: string): Promise<ProjectPub> {
    try {
      return await this.projectService.findPublishedByUuid(uuid);
    } catch (e) {
      throw new NotFoundException('Проект не найден');
    }
  }
}
