import { TestHelper } from '../@utils/TestHelper';
import { projectsFixture, usersFixture } from './@fixtures';

import { Task } from '../../src/@orm/task';
import { UserWork } from '../../src/@orm/user-work';

const h = new TestHelper('/user-works').addFixture(usersFixture).addFixture(projectsFixture);

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
      .post(h.path())
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com without projectId', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .post(h.path())
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by user@mail.com', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .post(h.path())
      .send({ projectId })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403,
    });
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy('admin@mail.com')
      .post(h.path())
      .send({ projectId })
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
      .post(h.path())
      .send({
        description: 'создана автоматически',
        projectId,
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
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .post(h.path())
      .send({
        description: 'создана автоматически',
        extraData: 'extra data',
        projectId,
        title: 'Новая задача',
      })
      .expect(422);
    expect(body).toEqual({
      errors: [
        {
          constraints: {
            whitelistValidation: 'property extraData should not exist',
          },
          property: 'extraData',
          target: {
            description: 'создана автоматически',
            extraData: 'extra data',
            projectId,
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
      .post(h.path())
      .send({
        description: 'Описание новой задачи',
        projectId,
        title: 'Задача Altiore',
      })
      .expect(201);
    expect(body).toEqual(
      expect.objectContaining({
        description: 'Описание новой задачи',
        taskId: expect.any(Number),
      })
    );
    const task = await h.findOne(Task, { id: body.taskId });
    expect(task).toEqual({
      description: 'Описание новой задачи',
      id: expect.any(Number),
      projectId: expect.any(Number),
      source: null,
      title: 'Задача Altiore',
      value: null,
    });
    await h.removeCreated(UserWork, { id: body.id });
    await h.removeCreated(Task, { id: body.taskId });
  });
});
