import moment = require('moment');

import { Media } from '../../@orm/media';
import { Project } from '../../@orm/project';
import { User } from '../../@orm/user';
import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { usersFixture } from './@fixtures/users';

const h = new TestHelper('/auth/login').addFixture(usersFixture);

describe(`PATCH ${h.url}`, () => {
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
    await h.removeCreated(Project, { id: addedUser.defaultProjectId });
    await h.removeCreated(User, { email });
    await h.removeCreated(Media, { id: addedUser.avatar.id });
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
      defaultProjectId: null,
      displayName: expect.any(String),
      email,
      id: expect.any(Number),
      role: 'user',
      tel: expect.any(String),
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
      defaultProjectId: null,
      displayName: expect.any(String),
      email,
      id: expect.any(Number),
      role: 'admin',
      tel: expect.any(String),
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
      defaultProjectId: null,
      displayName: expect.any(String),
      email,
      id: expect.any(Number),
      role: 'super-admin',
      tel: expect.any(String),
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
