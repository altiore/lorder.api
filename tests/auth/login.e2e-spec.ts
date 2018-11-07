import moment = require('moment');

import { TestHelper } from '../@utils/TestHelper';
import { usersFixture } from './@fixtures/users';

import { User } from '../../src/@orm/user';

const h = new TestHelper('/auth/login').addFixture(usersFixture);

describe(`PATCH ${h.url}`, async () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest - validation error', async () => {
    const { body } = await h
      .requestBy()
      .patch(h.url)
      .expect(422);
    expect(body).toEqual({
      errors: [
        {
          children: [],
          constraints: {
            isEmail: 'email must be an email',
            isNotEmpty: 'email should not be empty',
            isString: 'email must be a string',
          },
          property: 'email',
        },
        {
          children: [],
          constraints: {
            isNotEmpty: 'password should not be empty',
            isString: 'password must be a string',
            minLength: 'password must be longer than or equal to 6 characters',
          },
          property: 'password',
        },
      ],
      message: 'Validation Error',
      statusCode: 422,
    });
  });

  it('by guest - correct data', async () => {
    const email = 'razvanlomov+14@gmail.com';
    const password = 'correct password';
    const { body } = await h
      .requestBy()
      .patch(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
    expect(body).toEqual({
      errors: [
        {
          constraints: {
            isNotFound: expect.any(String),
          },
          property: 'email',
          value: email,
        },
      ],
      message: expect.any(String),
      statusCode: 422,
    });
    const addedUser = await h.findOne(User, { email });
    expect(addedUser).toEqual(
      expect.objectContaining({
        createdAt: expect.any(moment),
        email,
        roles: [{ id: 1, name: 'user' }],
        status: User.JUST_CREATED,
        updatedAt: expect.any(moment),
      })
    );
    await h.removeCreated(User, { email });
  });

  it('by user with password (own email)', async () => {
    const email = 'user+password@mail.com';
    const password = 'correct password';
    const { body } = await h
      .requestBy(email)
      .patch(h.url)
      .send({
        email,
        password,
      })
      .expect(200);
    expect(body).toEqual({
      avatar: null,
      bearerKey: expect.any(String),
      email,
      role: 'user',
    });
  });

  it('by user no-password (own email)', async () => {
    const email = 'no-password@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(email)
      .patch(h.url)
      .send({
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
      .requestBy(email)
      .patch(h.url)
      .send({
        email,
        password,
      })
      .expect(200);
    expect(body).toEqual({
      avatar: null,
      bearerKey: expect.any(String),
      email,
      role: 'admin',
    });
  });

  it('by admin no-password (own email)', async () => {
    const email = 'admin@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(email)
      .patch(h.url)
      .send({
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
      .requestBy(email)
      .patch(h.url)
      .send({
        email,
        password,
      })
      .expect(200);
    expect(body).toEqual({
      avatar: null,
      bearerKey: expect.any(String),
      email,
      role: 'super-admin',
    });
  });

  it('by super-admin no-password (own email)', async () => {
    const email = 'super-admin@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(email)
      .patch(h.url)
      .send({
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
