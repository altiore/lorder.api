import {
  CacheInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProjectPub } from '../@orm/project-pub';
import { ProjectService } from '../project/project.service';

@ApiTags('public')
@Controller('public')
@UseInterceptors(CacheInterceptor)
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
