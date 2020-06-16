import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { taskTypesFixtures, usersFixture } from './@fixtures/get';

const h = new TestHelper('/task-types').addFixture(usersFixture).addFixture(taskTypesFixtures);

describe(`GET ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .get(h.path())
      .expect(401)
      .expect({
        message: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com', async () => {
    const { body } = await h
      .requestBy(await h.getUser('user@mail.com'))
      .get(h.path())
      .expect(200);

    expect(body).toEqual(expect.arrayContaining(h.entities.TaskType));
  });

  it('by admin@mail.com', async () => {
    const { body } = await h
      .requestBy(await h.getUser('admin@mail.com'))
      .get(h.path())
      .expect(200);

    expect(body).toEqual(expect.arrayContaining(h.entities.TaskType));
  });

  it('by owner', async () => {
    const { body } = await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .get(h.path())
      .expect(200);

    expect(body).toEqual(expect.arrayContaining(h.entities.TaskType));
  });
});
