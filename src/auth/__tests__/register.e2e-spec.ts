import moment = require('moment');

import { Media } from '../../@orm/media';
import { Project } from '../../@orm/project';
import { User } from '../../@orm/user';
import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { usersFixture } from './@fixtures/users';

const h = new TestHelper('/auth/register').addFixture(usersFixture);

describe(`POST ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest - validation error', async () => {
    const { body } = await h.requestBy().post(h.url).expect(422);
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
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(202);
    expect(body).toEqual({
      statusMessage: expect.any(String),
      statusCode: 202,
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
      .requestBy(await h.getUser(email))
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
    expect(body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            constraints: {
              isExists: 'Пользователь с таким email-ом уже существует',
            },
          }),
        ]),
      })
    );
  });

  it('by user no-password (own email)', async () => {
    const email = 'no-password@mail.com';
    const password = 'new password';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
    expect(body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            constraints: {
              isExists: 'Пользователь с таким email-ом уже существует',
            },
          }),
        ]),
      })
    );
  });

  it('by admin with password (own email)', async () => {
    const email = 'admin+password@mail.com';
    const password = 'correct password';
    await h
      .requestBy(await h.getUser(email))
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
  });

  it('by admin no-password (own email)', async () => {
    const email = 'admin@mail.com';
    const password = 'new password';
    await h
      .requestBy(await h.getUser(email))
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
  });

  it('by super-admin with password (own email)', async () => {
    const email = 'super-admin+password@mail.com';
    const password = 'correct password';
    await h
      .requestBy(await h.getUser(email))
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
  });

  it('by super-admin no-password (own email)', async () => {
    const email = 'super-admin@mail.com';
    const password = 'new password';
    await h
      .requestBy(await h.getUser(email))
      .post(h.url)
      .send({
        email,
        password,
      })
      .expect(422);
  });
});
