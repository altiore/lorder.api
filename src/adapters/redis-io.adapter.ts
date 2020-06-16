import { IoAdapter } from '@nestjs/platform-socket.io';

import * as redisIoAdapter from 'socket.io-redis';

import { ServerOptions } from 'socket.io';

const redisAdapter = redisIoAdapter({ host: 'localhost', port: 6379 });

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(redisAdapter);
    return server;
  }
}
