import { TestHelper } from '../@utils/TestHelper';
import { projectsFixture, tasksFixture, usersFixture, userWorksFixture } from './@fixtures/get';

const h = new TestHelper('/tasks')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

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
    expect(body).toEqual(
      expect.arrayContaining([
        {
          description: expect.any(String),
          id: expect.any(Number),
          projectId: expect.any(Number),
          source: null,
          title: expect.any(String),
          userWorks: expect.arrayContaining([
            expect.objectContaining({
              description: expect.any(String),
              finishAt: expect.any(String),
              id: expect.any(Number),
              source: expect.any(String),
              startAt: expect.any(String),
              value: expect.any(Number),
            }),
          ]),
          value: expect.any(Number),
        },
      ])
    );
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
