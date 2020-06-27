import { Provider } from '@nestjs/common';

import { create } from 'cache-manager-redis-store';

import { REDIS_CACHE_MANAGER } from './redis.constants';

export function createCacheManager(): Provider {
  return {
    provide: REDIS_CACHE_MANAGER,
    useFactory: async (configService) => {
      return create({ url: process.env.REDISCLOUD_URL }).getClient();
    },
  };
}
