import { TestHelper } from '../../@utils/TestHelper';
import { projectsFixture, usersFixture } from './@fixtures';

import { Task } from '../../../src/@orm/task';
import { UserTask } from '../../../src/@orm/user-task';

const h = new TestHelper('/projects/:projectId/user-tasks').addFixture(usersFixture).addFixture(projectsFixture);

describe(`POST ${h.url}`, async () => {
  let projectId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .post(h.path(projectId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com', async () => {
    await h
      .requestBy('user@mail.com')
      .post(h.path(projectId))
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy('admin@mail.com')
      .post(h.path(projectId))
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by owner with validation error (title not set)', async () => {
    await h
      .requestBy('super-admin@mail.com')
      .post(h.path(projectId))
      .send({
        description: 'создана автоматически',
      })
      .expect(422)
      .expect({
        errors: [
          {
            children: [],
            constraints: {
              isNotEmpty: 'title should not be empty',
              isString: 'title must be a string',
              maxLength: 'title must be shorter than or equal to 40 characters',
              minLength: 'title must be longer than or equal to 3 characters',
            },
            property: 'title',
          },
        ],
        message: 'Validation Error',
        statusCode: 422,
      });
  });

  it('by owner with extra data', async () => {
    await h
      .requestBy('super-admin@mail.com')
      .post(h.path(projectId))
      .send({
        description: 'создана автоматически',
        extraData: 'extra data',
        title: 'Новая задача',
      })
      .expect(422)
      .expect({
        errors: [
          {
            constraints: {
              whitelistValidation: 'property extraData should not exist',
            },
            property: 'extraData',
            target: {
              description: 'создана автоматически',
              extraData: 'extra data',
              title: 'Новая задача',
            },
            value: 'extra data',
          },
        ],
        message: 'Validation Error',
        statusCode: 422,
      });
  });

  it('by owner with correct data', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .post(h.path(projectId))
      .send({
        title: 'Новая задача',
      })
      .expect(201);
    expect(body).toEqual(
      expect.objectContaining({
        description: 'Новая задача 1',
      })
    );
    await h.removeCreated(UserTask, { id: body.id });
    await h.removeCreated(Task, { title: 'Новая задача' });
  });
});
