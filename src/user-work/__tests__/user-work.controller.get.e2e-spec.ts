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
      .requestBy('user@mail.com')
      .get(h.path())
      .expect(200)
      .expect([]);
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy('admin@mail.com')
      .get(h.path())
      .expect(200)
      .expect([]);
  });

  it('by owner', async () => {
    await h
      .requestBy('super-admin@mail.com')
      .get(h.path())
      .expect(200)
      .expect([]);
  });
});
