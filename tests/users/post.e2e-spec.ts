import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { RedisService } from '../../src/redis/redis.service';

const BASE_URL = '/users';

describe(`POST ${BASE_URL} (e2e)`, () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    app.get(RedisService).closeConnection();
    const connection = getConnection();
    await connection.close();
  });

  it('by guest', () => {
    return request(app.getHttpServer())
      .post(BASE_URL)
      .expect(404)
      .expect({
        error: 'Not Found',
        message: 'Cannot POST /users',
        statusCode: 404,
      });
  });
});
