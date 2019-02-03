import { TestHelper } from '../@utils/TestHelper';
import { taskTypesFixtures, usersFixture } from './@fixtures/get';

const h = new TestHelper('/task-types').addFixture(usersFixture).addFixture(taskTypesFixtures);

describe(`GET ${h.url}`, async () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .get(h.path())
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .get(h.path())
      .expect(200);

    expect(body).toEqual(h.entities.TaskType);
  });

  it('by admin@mail.com', async () => {
    const { body } = await h
      .requestBy('admin@mail.com')
      .get(h.path())
      .expect(200);

    expect(body).toEqual(h.entities.TaskType);
  });

  it('by owner', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .get(h.path())
      .expect(200);

    expect(body).toEqual(h.entities.TaskType);
  });
});
