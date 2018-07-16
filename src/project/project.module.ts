import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository, ProjectTaskTypeRepository])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
