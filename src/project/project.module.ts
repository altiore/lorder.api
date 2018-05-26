import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRepository } from '../@entities/project';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
