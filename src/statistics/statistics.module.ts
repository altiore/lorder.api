import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { ProjectPubRepository } from '../@orm/project-pub';
import { UserRepository } from '../@orm/user';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  exports: [StatisticsService],
  imports: [TypeOrmModule.forFeature([ProjectPubRepository, ProjectRepository, UserRepository])],
  providers: [StatisticsService],
})
export class StatisticsModule {}
