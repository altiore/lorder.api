import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { projectsFixture, usersFixture } from './@fixtures/get';

const h = new TestHelper('/user-works').addFixture(usersFixture).addFixture(projectsFixture);

describe(`GET ${h.url} user-work.controller`, () => {
  beforeAll(async () => {
    await h.before();
  });
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
    await h
      .requestBy(await h.getUser('user@mail.com'))
      .get(h.path())
      .expect(200)
      .expect([]);
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy(await h.getUser('admin@mail.com'))
      .get(h.path())
      .expect(200)
      .expect([]);
  });

  it('by owner', async () => {
    await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .get(h.path())
      .expect(200)
      .expect([]);
  });
});
