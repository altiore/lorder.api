import * as jwt from 'jsonwebtoken';

import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { sessionsFixture, usersFixture } from './@fixtures/users';

const h = new TestHelper('/auth/refresh').addFixture(usersFixture).addFixture(sessionsFixture);

describe(`PATCH refresh ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest - validation error', async () => {
    await h
      .requestBy()
      .patch(h.url)
      .expect(401);
  });

  it('empty device', async () => {
    const email = 'super-admin+password@mail.com';
    await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        refreshToken: 'incorrect-token',
      })
      .expect(422);
  });

  it('incorrect refresh token', async () => {
    const email = 'super-admin+password@mail.com';
    await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        refreshToken: 'incorrect-token',
      })
      .expect(401);
  });

  it('by super-admin+password@mail.com - expired token', async () => {
    const email = 'super-admin+password@mail.com';
    await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        refreshToken: 'correct-refresh-token',
      })
      .expect(401);
  });

  it('by super-admin+password@mail.com - correct token, but incorrect headers', async () => {
    const userId = await h.getUser('super-admin+password@mail.com');
    const correctRefreshToken = jwt.sign({ uid: userId }, process.env.JWT_SECRET);
    await h.manager.query(`UPDATE "session" SET "refreshToken"='${correctRefreshToken}' WHERE "userId"=${userId}`);
    await h
      .requestBy(userId)
      .patch(h.url)
      .send({
        device: 'common',
        refreshToken: correctRefreshToken,
      })
      .expect(200);
  });
});
