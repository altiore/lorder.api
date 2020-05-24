import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { projectsFixture, taskCommentsFixture, tasksFixture, userProjectsFixture, usersFixture } from './@fixtures/get';

const h = new TestHelper('/projects/:projectId/tasks/:taskId/comments')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(taskCommentsFixture);

let projectId: number;
let taskId: number;

describe(`GET ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    taskId = h.entities.Task[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .get(h.path(projectId, taskId))
      .expect(401)
      .expect({
        message: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by member@mail.com RED level', async () => {
    const { body } = await h
      .requestBy(await h.getUser('member@mail.com'))
      .get(h.path(projectId, taskId))
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        count: 3,
        data: expect.any(Object),
        page: 1,
        pageCount: 1,
        total: 3,
      })
    );
  });

  it('by not-owner@mail.com ORANGE level', async () => {
    const { body } = await h
      .requestBy(await h.getUser('not-owner@mail.com'))
      .get(h.path(projectId, taskId))
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        count: 3,
        data: expect.any(Object),
        page: 1,
        pageCount: 1,
        total: 3,
      })
    );
  });

  it('by project-owner@mail.com', async () => {
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .get(h.path(projectId, taskId))
      .expect(200);

    expect(body).toEqual(
      expect.objectContaining({
        count: 3,
        data: expect.any(Object),
        page: 1,
        pageCount: 1,
        total: 3,
      })
    );
  });

  it('by white-level@mail.com', async () => {
    await h
      .requestBy(await h.getUser('white-level@mail.com'))
      .get(h.path(projectId, taskId))
      .expect(403);
  });
});
