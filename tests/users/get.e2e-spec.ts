import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { getConnection } from 'typeorm';

import { AppModule } from '../../src/app.module';
import { RedisService } from '../../src/redis/redis.service';

const BASE_URL = '/users';

describe(`GET ${BASE_URL} (e2e)`, () => {
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
      .get(BASE_URL)
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user', () => {
    return request(app.getHttpServer())
      .post(BASE_URL)
      .set(
        'Authorization',
        `Bearer ${jwt.sign({ email: 'razvanlomov@gmail.com' }, process.env.JWT_SECRET, { expiresIn: 3600 })}`
      )
      .expect(404)
      .expect({
        error: 'Not Found',
        message: 'Cannot POST /users',
        statusCode: 404,
      });
  });
});
