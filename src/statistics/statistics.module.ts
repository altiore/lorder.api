import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectPubRepository } from '@orm/project-pub/project-pub.repository';
import { ProjectRepository } from '@orm/project/project.repository';
import { UserRepository } from '@orm/user/user.repository';

import { RedisModule } from '../redis/redis.module';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

@Module({
  controllers: [StatisticsController],
  exports: [StatisticsService],
  imports: [
    RedisModule.registerCache(),
    TypeOrmModule.forFeature([ProjectPubRepository, ProjectRepository, UserRepository]),
  ],
  providers: [StatisticsService],
})
export class StatisticsModule {}
