import { TaskType } from '@orm/entities/task-type.entity';

import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { taskTypesFixtures, usersFixture } from './@fixtures/post';

const h = new TestHelper('/task-types').addFixture(usersFixture).addFixture(taskTypesFixtures);

describe(`POST ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest', async () => {
    await h.requestBy().post(h.path()).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by user@mail.com', async () => {
    await h
      .requestBy(await h.getUser('user@mail.com'))
      .post(h.path())
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy(await h.getUser('admin@mail.com'))
      .post(h.path())
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by super-admin@mail.com with empty data', async () => {
    await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .post(h.path())
      .send({
        name: '',
      })
      .expect(422);
  });

  it('by super-admin@mail.com only with title', async () => {
    const taskType = {
      name: 'Test type',
    };

    const { body } = await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .post(h.path())
      .send(taskType)
      .expect(201);

    expect(body).toEqual({
      ...taskType,
      id: expect.any(Number),
    });

    await h.removeCreated(TaskType, { id: body.id });
  });

  it('by super-admin@mail.com with correct data', async () => {
    const taskType = {
      name: 'Test type',
    };

    const { body } = await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .post(h.path())
      .send(taskType)
      .expect(201);

    expect(body).toEqual({
      ...taskType,
      id: expect.any(Number),
    });

    await h.removeCreated(TaskType, { id: body.id });
  });
});
