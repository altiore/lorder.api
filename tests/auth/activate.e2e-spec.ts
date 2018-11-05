import { create } from 'cache-manager-redis-store';
import moment = require('moment');

import { TestHelper } from '../@utils/TestHelper';
import { projectsFixture } from './@fixtures/projects';
import { userProjectsFixture } from './@fixtures/userProjects';
import { usersFixture } from './@fixtures/usersForActivate';

import { User } from '../../src/@orm/user';
import { ACCESS_LEVEL, UserProject } from '../../src/@orm/user-project';
import { RedisService } from '../../src/redis/redis.service';

const h = new TestHelper('/auth/activate')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture);

describe(`GET ${h.url}`, async () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('validation error', async () => {
    const { body } = await h
      .requestBy()
      .get(h.url)
      .expect(422);
    expect(body).toEqual({
      errors: [
        {
          children: [],
          constraints: {
            isNotEmpty: expect.any(String),
            isString: expect.any(String),
          },
          property: 'oneTimeToken',
        },
      ],
      message: 'Validation Error',
      statusCode: 422,
    });
  });

  it('correct data but token not exists', async () => {
    const oneTimeToken = 'asdf';
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        oneTimeToken,
      })
      .expect(404);
    expect(body).toEqual({
      error: 'Not Found',
      message: expect.any(String),
      statusCode: 404,
    });
  });

  it('no-password - correct data with correct token', async () => {
    const user = h.entities.User[0];
    const email = user.email;
    const redisService = new RedisService(create({ url: undefined }).getClient());
    const oneTimeToken = await redisService.createOneTimeToken({
      email,
    });
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        oneTimeToken,
      })
      .expect(200);
    expect(body).toEqual({
      bearerKey: expect.any(String),
      email,
      role: 'user',
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

  it('with password - correct data with correct token', async () => {
    const user = h.entities.User[1];
    const email = user.email;
    const redisService = new RedisService(create({ url: undefined }).getClient());
    const oneTimeToken = await redisService.createOneTimeToken({
      email,
      password: 'correct password',
    });
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        oneTimeToken,
      })
      .expect(200);
    expect(body).toEqual({
      bearerKey: expect.any(String),
      email,
      role: 'user',
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
    const redisService = new RedisService(create({ url: undefined }).getClient());
    const oneTimeToken = await redisService.createOneTimeToken({
      email,
    });
    const { body } = await h
      .requestBy()
      .get(h.url)
      .query({
        oneTimeToken,
        project: project.id,
      })
      .expect(200);
    expect(body).toEqual({
      bearerKey: expect.any(String),
      email,
      role: 'user',
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
