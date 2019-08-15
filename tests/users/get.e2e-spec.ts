import { TestHelper } from '../@utils/TestHelper';
import { usersFixture } from './@fixtures/users';

const h = new TestHelper('/users').addFixture(usersFixture);

describe(`GET ${h.url}`, () => {
  beforeAll(h.before);
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .get(h.url)
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user', async () => {
    await h
      .requestBy('user@mail.com')
      .get(h.url)
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by admin', async () => {
    await h
      .requestBy('admin@mail.com')
      .get(h.url)
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by super-admin', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .get(h.url)
      .expect(200);
    expect(body.map(el => el.email)).toEqual(
      expect.arrayContaining([
        'admin@mail.com',
        'super-admin@mail.com',
        'user@mail.com',
        'razvanlomov@gmail.com',
      ])
    );
  });
});
