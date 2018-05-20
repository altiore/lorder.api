import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /users', () => {
    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect('Hello Users!');
  });

  it('/POST /users', () => {
    return request(app.getHttpServer())
      .post('/users')
      .expect(201)
      .expect('');
  });
});
