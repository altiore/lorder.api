import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../@orm/project';
import { TaskTypeRepository } from '../@orm/task-type';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository, ProjectTaskTypeRepository, TaskTypeRepository])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
