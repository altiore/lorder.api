import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectPart } from '@orm/entities/project-part.entity';

import { ProjectModule } from '../project/project.module';
import { ProjectPartController } from './project-part.controller';
import { ProjectPartService } from './project-part.service';

@Module({
  controllers: [ProjectPartController],
  exports: [ProjectPartService],
  imports: [forwardRef(() => ProjectModule), TypeOrmModule.forFeature([ProjectPart])],
  providers: [ProjectPartService],
})
export class ProjectPartModule {}
