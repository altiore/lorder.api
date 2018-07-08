import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';
import * as jwt from 'jsonwebtoken';

import { AppModule } from '../../src/app.module';

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
    const connection = getConnection();
    await connection.close();
  });

  it('by guest', () => {
    return request(app.getHttpServer())
      .get(BASE_URL)
      .expect(401)
      .expect({
        statusCode: 401,
        error: 'Unauthorized',
      });
  });

  it('by user', () => {
    return request(app.getHttpServer())
      .post(BASE_URL)
      .set(
        'Authorization',
        `Bearer ${jwt.sign({ email: 'razvanlomov@gmail.com' }, process.env.JWT_SECRET, { expiresIn: 3600 })}`,
      )
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: 'Cannot POST /users',
      });
  });
});
