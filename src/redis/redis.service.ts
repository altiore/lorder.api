import { Inject, Injectable } from '@nestjs/common';

import * as guid from 'uuid/v4';

import { UserDataDto } from './dto/user.data.dto';
import { REDIS_CACHE_MANAGER } from './redis.constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CACHE_MANAGER) private readonly redis: any) {}

  createOneTimeToken(userData: UserDataDto, expiresInSeconds: number = 300): Promise<string> {
    const token = guid();
    return new Promise((resolve, reject) => {
      this.redis.hmset(token, userData as any, err => {
        if (err) {
          reject(err);
        } else {
          this.redis.expire(token, expiresInSeconds, err2 => {
            if (err2) {
              reject(err2);
            } else {
              resolve(token);
            }
          });
        }
      });
    });
  }

  findUserDataByOneTimeToken(token: string): Promise<UserDataDto> {
    return new Promise((resolve, reject) => {
      this.redis.hgetall(token, (err, userData) => {
        if (err) {
          reject(err);
        } else {
          this.redis.del(token, err2 => {
            if (err2) {
              reject(err2);
            } else {
              if (userData && userData.email) {
                resolve({
                  email: userData.email,
                  password: userData.password,
                });
              } else {
                reject('data is empty');
              }
            }
          });
        }
      });
    });
  }

  closeConnection(): Promise<void> {
    return new Promise((ok, reject) => {
      this.redis.quit(err => {
        if (err) {
          reject();
        } else {
          ok();
        }
      });
    });
  }

  resetAll() {
    return this.redis.flushdb();
  }
}
