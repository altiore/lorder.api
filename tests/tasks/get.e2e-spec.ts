import { TestHelper } from '../@utils/TestHelper';
import {
  projectsFixture,
  tasksFixture,
  userProjectFixture,
  usersFixture,
  userWorksFixture,
} from './@fixtures/get';

const h = new TestHelper('/tasks')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

describe(`GET ${h.url}`, () => {
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
          createdAt: expect.any(String),
          createdById: null,
          description: expect.any(String),
          id: expect.any(Number),
          isArchived: false,
          performerId: expect.any(Number),
          projectId: expect.any(Number),
          source: null,
          status: 2,
          title: expect.any(String),
          typeId: null,
          updatedAt: expect.any(String),
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

  it('by removed@mail.com', async () => {
    const { body } = await h
      .requestBy('removed@mail.com')
      .get(h.path())
      .expect(200);
    expect(body).toEqual([]);
  });

  it('by white-status@mail.com', async () => {
    const { body } = await h
      .requestBy('white-status@mail.com')
      .get(h.path())
      .expect(200);
    expect(body).toEqual([]);
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
