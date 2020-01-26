import { Module } from '@nestjs/common';

import { ProjectModule } from '../project/project.module';
import { RedisModule } from '../redis/redis.module';

import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController],
  exports: [],
  imports: [RedisModule.registerCache(), ProjectModule],
  providers: [],
})
export class PublicModule {}
