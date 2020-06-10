/* tslint:disable */
import { INestApplication, ModuleMetadata } from '@nestjs/common/interfaces';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeormFixtures } from 'typeorm-fixtures';
import { DeleteResult, EntityManager, FindConditions, getConnection, In, ObjectID, ObjectType } from 'typeorm';
import * as supertest from 'supertest';
const defaults = require('superagent-defaults');
import * as jwt from 'jsonwebtoken';
import * as v8 from 'v8';

import { RedisService } from '../../redis/redis.service';
import { Role } from '../../@orm/role';
import { MailService } from '../../mail/mail.service';
import { MailAcceptedDto } from '../../mail/dto';
import { User } from '../../@orm/user';

export class TestHelper {
  private testingModule: TestingModule;
  private app: INestApplication;
  private fixtureHelper: TypeormFixtures<{ Role: any[] }>;

  constructor(
    public readonly url: string,
    public metadata?: ModuleMetadata,
    public readonly debug: boolean = process.env.TYPEORM_LOGGING === 'true'
  ) {
    const findCondition = {
      where: {
        name: In(['user', 'admin', 'super-admin']),
      },
    };
    this.fixtureHelper = new TypeormFixtures(debug).findEntities(findCondition, Role);
    v8.setFlagsFromString('--expose_gc');
  }

  public get manager(): EntityManager {
    return this.fixtureHelper.connection.manager;
  }

  public readonly before = async (): Promise<void> => {
    await this.fixtureHelper.loadFixtures();
    if (!this.metadata) {
      const appModule = await import('../../app.module');
      this.metadata = { imports: [appModule.AppModule] };
    }
    this.testingModule = await Test.createTestingModule(this.metadata)
      .overrideProvider(MailService)
      .useValue(
        new class {
          public async sendMagicLink(): Promise<MailAcceptedDto> {
            return {
              statusCode: 202,
              statusMessage: 'TEST Accepted',
            };
          }
        }()
      )
      .compile();
    this.app = await this.testingModule.createNestApplication().init();
  };

  public readonly after = async (): Promise<void> => {
    await this.fixtureHelper.dropFixtures();
    await getConnection().close();
    await this.app.get(RedisService).closeConnection();

    this.testingModule = null;
    this.fixtureHelper = null;
    this.metadata = null;

    try {
      if (global.gc) {
        global.gc();
      }
    } catch (e) {
      console.log('`node --expose-gc index.js`');
      process.exit();
    }

    await this.app.close();
  };

  public async getUser(email?: string): Promise<number | undefined> {
    const user = await this.findOne(User, { email });
    return user ? user.id : undefined;
  }

  public readonly requestBy = (uid?: number): supertest.SuperTest<supertest.Test> => {
    const request = defaults(supertest(this.app.getHttpServer()));
    const headers = {
      'Content-Type': 'application/json',
    } as any;
    if (uid) {
      const token = jwt.sign({ uid }, process.env.JWT_SECRET, { expiresIn: 3600 });
      headers.Authorization = `Bearer ${token}`;
    }
    request.set(headers);
    return request;
  };

  public addFixture<EntityType>(data: { fixtures: (loadedFixtures: any) => any[]; Entity: ObjectType<EntityType> }) {
    this.fixtureHelper.addFixture(data);
    return this;
  }

  public async removeCreated<EntityType>(
    Entity: ObjectType<EntityType>,
    criteria: string | string[] | number | number[] | Date | Date[] | ObjectID | ObjectID[] | FindConditions<EntityType>
  ): Promise<DeleteResult> {
    return this.fixtureHelper.removeCreated(Entity, criteria);
  }

  public async findOne<EntityType>(Entity: ObjectType<EntityType>, criteria): Promise<EntityType> {
    return await this.fixtureHelper.findOneExisting(Entity, criteria);
  }

  public async findMany<EntityType>(Entity: ObjectType<EntityType>, criteria) {
    return await this.fixtureHelper.findManyExisting(Entity, criteria);
  }

  get entities() {
    return this.fixtureHelper.entities;
  }

  /**
   * Return path with replaced params.
   * For example this url `/users/:userId/projects/:projectId` will be replaced like this:
   * ```ts
   *   this.path(15, 84); // it will return such string -> `/users/15/projects/84`
   * ```
   * @param atrs
   */
  path(...atrs: (string | number)[]): string {
    const matches = this.url.match(/\:\w*/g);
    return atrs.reduce<string>((res: string, atr: string | number, index) => {
      return res.replace(matches[index], typeof atr === 'number' ? atr.toString() : atr);
    }, this.url) as string;
  }
}

expect.extend({
  // @ts-ignore
  toBeWithinRange(received: any, floor: any, ceiling: any): { message(): string; pass: boolean } {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
} as any);
