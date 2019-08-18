import { CacheModule, CacheModuleOptions, DynamicModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';

import { REDIS_CACHE_MANAGER } from './redis.constants';
import { RedisController } from './redis.controller';
import { createCacheManager } from './redis.providers';
import { RedisService } from './redis.service';

@Module({
  controllers: [RedisController],
  exports: [RedisService, REDIS_CACHE_MANAGER],
  providers: [createCacheManager(), RedisService],
})
export class RedisModule {
  /**
   * Put result of this function to imports in order make
   * redis cache available using @UseInterceptors(CacheInterceptor) syntax
   * @param options
   */
  static registerCache(options?: CacheModuleOptions): DynamicModule {
    return CacheModule.registerAsync({
      imports: [RedisModule],
      inject: [RedisService],
      useFactory: async (redisService: RedisService) => {
        const allOptions = {
          ttl: 30,
          ...(options || {}),
        };
        return {
          store: redisStore,
          url: process.env.REDISCLOUD_URL,
          ...allOptions,
        };
      },
    });
  }
}
