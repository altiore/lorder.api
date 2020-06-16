import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { usersFixture } from './@fixtures/users';

const h = new TestHelper('/auth/login').addFixture(usersFixture);

describe(`PATCH ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest - validation error', async () => {
    await h
      .requestBy()
      .patch(h.url)
      .expect(422);
  });

  it('by guest - correct data', async () => {
    const email = 'razvanlomov+14@gmail.com';
    const password = 'correct password';
    const { body } = await h
      .requestBy()
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
      })
      .expect(422);
    expect(body).toEqual({
      errors: expect.arrayContaining([
        {
          constraints: {
            isNotFound: expect.any(String),
          },
          property: 'email',
          value: email,
        },
      ]),
      message: expect.any(String),
      statusCode: 422,
    });
  });

  it('by user with password (own email)', async () => {
    const email = 'user+password@mail.com';
    const password = 'correct password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
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
  });

  it('by user no-password (own email)', async () => {
    const email = 'no-password@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
      })
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by admin with password (own email)', async () => {
    const email = 'admin+password@mail.com';
    const password = 'correct password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
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
      role: 'admin',
      tel: expect.any(String),
    });
  });

  it('by admin no-password (own email)', async () => {
    const email = 'admin@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
      })
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by super-admin with password (own email)', async () => {
    const email = 'super-admin+password@mail.com';
    const password = 'correct password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
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
      role: 'super-admin',
      tel: expect.any(String),
    });
  });

  it('by super-admin no-password (own email)', async () => {
    const email = 'super-admin@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.url)
      .send({
        device: 'common',
        email,
        password,
      })
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });
});
