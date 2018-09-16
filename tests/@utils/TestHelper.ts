/* tslint:disable */
import { INestApplication, ModuleMetadata } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormFixtures } from 'typeorm-fixtures';
import { ObjectType, getConnection } from 'typeorm';
import * as supertest from 'supertest';
const defaults = require('superagent-defaults');
import * as jwt from 'jsonwebtoken';

import { AppModule } from '../../src/app.module';
import { RedisService } from '../../src/redis/redis.service';
import { Role } from '../../src/@orm/role';

export class TestHelper {
  private testingModule: TestingModule;
  private app: INestApplication;
  private fixtureHelper: TypeormFixtures<{ Role: any[] }>;

  constructor(
    public readonly url: string,
    public readonly metadata: ModuleMetadata = { imports: [AppModule] },
    public readonly debug: boolean = false
  ) {
    this.fixtureHelper = new TypeormFixtures(debug).findEntities({}, Role);
  }

  public readonly before = async (): Promise<void> => {
    await this.fixtureHelper.loadFixtures();
    this.testingModule = await Test.createTestingModule(this.metadata).compile();
    this.app = await this.testingModule.createNestApplication().init();
  };

  public readonly after = async (): Promise<void> => {
    await this.fixtureHelper.dropFixtures();
    await getConnection().close();
    await this.app.get(RedisService).closeConnection();
    await this.app.close();
  };

  public readonly requestBy = (email?: string): supertest.SuperTest<supertest.Test> => {
    const request = defaults(supertest(this.app.getHttpServer()));
    const headers = {
      'Content-Type': 'application/json',
    } as any;
    if (email) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 3600 });
      headers.Authorization = `Bearer ${token}`;
    }
    request.set(headers);
    return request;
  };

  public addFixture<EntityType>(data: { fixtures: (loadedFixtures: any) => any[]; Entity: ObjectType<EntityType> }) {
    this.fixtureHelper.addFixture(data);
    return this;
  }

  get entities() {
    return this.fixtureHelper.entities;
  }
}
