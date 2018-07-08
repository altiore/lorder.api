import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { getConnection } from 'typeorm';

import { AppModule } from '../../src/app.module';

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
    const connection = getConnection();
    await connection.close();
  });

  it('by guest', () => {
    return request(app.getHttpServer())
      .post(BASE_URL)
      .expect(404)
      .expect({
        statusCode: 404,
        error: 'Not Found',
        message: 'Cannot POST /users',
      });
  });
});
