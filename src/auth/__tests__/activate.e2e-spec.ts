import { create } from 'cache-manager-redis-store';
import moment = require('moment');

import { ACCESS_LEVEL, UserProject } from '@orm/entities/user-project.entity';
import { User } from '@orm/entities/user.entity';

import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { RedisService } from '../../redis/redis.service';
import { projectsFixture } from './@fixtures/projects';
import { userProjectsFixture } from './@fixtures/userProjects';
import { usersFixture } from './@fixtures/usersForActivate';

const h = new TestHelper('/auth/activate')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture);

describe(`GET ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('validation error', async () => {
    const { body } = await h.requestBy().get(h.url).expect(422);
    expect(body).toEqual({
      errors: expect.arrayContaining([
        expect.objectContaining({
          children: [],
          constraints: {
            isNotEmpty: expect.any(String),
            isString: expect.any(String),
          },
          property: 'oneTimeToken',
        }),
        expect.objectContaining({
          children: [],
          constraints: {
            isNotEmpty: expect.any(String),
            isString: expect.any(String),
          },
          property: 'device',
        }),
      ]),
      message: 'Validation Error',
      statusCode: 422,
    });
  });

  it('correct data but token not exists', async () => {
    const oneTimeToken = 'asdf';
    await h
      .requestBy()
      .get(h.url)
      .query({
        oneTimeToken,
      })
      .expect(422);
  });

  it('no-password - correct data with correct token', async () => {
    const user = h.entities.User[0];
    const email = user.email;
    const redisService = new RedisService(
      create({
        ttl: 30,
        url: process.env.REDISCLOUD_URL,
      }).getClient()
    );
    const oneTimeToken = await redisService.createOneTimeToken({
      email,
    });
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        device: 'common',
        oneTimeToken,
      })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        avatar: null,
        bearerKey: expect.any(String),
        defaultProjectId: null,
        displayName: expect.any(String),
        email,
        expiresIn: expect.any(Number),
        id: expect.any(Number),
        role: 'user',
        tel: expect.any(String),
      })
    );
    const addedUser = await h.findOne(User, { email });
    expect(addedUser).toEqual(
      expect.objectContaining({
        createdAt: expect.any(moment),
        email,
        roles: [{ id: 1, name: 'user' }],
        status: User.ACTIVATED,
        updatedAt: expect.any(moment),
      })
    );
    await redisService.closeConnection();
  });

  it('with password - correct data with correct token', async () => {
    const user = h.entities.User[1];
    const email = user.email;
    const redisService = new RedisService(
      create({
        ttl: 30,
        url: process.env.REDISCLOUD_URL,
      }).getClient()
    );
    const oneTimeToken = await redisService.createOneTimeToken({
      email,
      password: 'correct password',
    });
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        device: 'common',
        oneTimeToken,
      })
      .expect(200);
    expect(body).toEqual({
      avatar: null,
      bearerKey: expect.any(String),
      defaultProjectId: null,
      displayName: expect.any(String),
      email,
      expiresIn: expect.any(Number),
      id: expect.any(Number),
      refreshToken: expect.any(String),
      role: 'user',
      tel: expect.any(String),
    });
    const addedUser = await h.findOne(User, { email });
    expect(addedUser).toEqual(
      expect.objectContaining({
        createdAt: expect.any(moment),
        email,
        roles: [{ id: 1, name: 'user' }],
        status: User.ACTIVATED,
        updatedAt: expect.any(moment),
      })
    );
    await redisService.closeConnection();
  });

  it('with project activation', async () => {
    const user = h.entities.User[2];
    const project = h.entities.Project[0];
    const email = user.email;
    const redisService = new RedisService(
      create({
        ttl: 30,
        url: process.env.REDISCLOUD_URL,
      }).getClient()
    );
    const oneTimeToken = await redisService.createOneTimeToken({
      email,
    });
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        device: 'common',
        oneTimeToken,
        project: project.id,
      })
      .expect(200);
    expect(body).toEqual({
      avatar: null,
      bearerKey: expect.any(String),
      defaultProjectId: null,
      displayName: expect.any(String),
      email,
      expiresIn: expect.any(Number),
      id: expect.any(Number),
      refreshToken: expect.any(String),
      role: 'user',
      tel: expect.any(String),
    });
    const addedUser = await h.findOne(User, { email });
    expect(addedUser).toEqual(
      expect.objectContaining({
        createdAt: expect.any(moment),
        email,
        roles: [{ id: 1, name: 'user' }],
        status: User.ACTIVATED,
        updatedAt: expect.any(moment),
      })
    );
    const addedUserProject = await h.findOne(UserProject, { member: { id: user.id } });
    expect(addedUserProject).toEqual(
      expect.objectContaining({
        accessLevel: ACCESS_LEVEL.RED,
        member: expect.objectContaining({
          email: user.email,
        }),
      })
    );
    await h.removeCreated(UserProject, { member: { id: user.id } });
    await redisService.closeConnection();
  });
});
