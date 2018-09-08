import { Module } from '@nestjs/common';
import { create } from 'cache-manager-redis-store';

import { RedisClientProvider } from './redis.constants';
import { RedisService } from './redis.service';

const redisProvider = {
  provide: RedisClientProvider,
  useValue: create({ url: process.env.REDISCLOUD_URL }).getClient(),
};

@Module({
  exports: [RedisService],
  providers: [redisProvider, RedisService],
})
export class RedisModule {}
