import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectPub } from '@orm/entities/project-pub.entity';

import { PublicProjectController } from './public-project.controller';
import { PublicProjectService } from './public-project.service';

@Module({
  controllers: [PublicProjectController],
  exports: [PublicProjectService],
  imports: [TypeOrmModule.forFeature([ProjectPub])],
  providers: [PublicProjectService],
})
export class PublicProjectModule {}
