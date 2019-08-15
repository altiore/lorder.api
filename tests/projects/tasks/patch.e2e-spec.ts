import { TestHelper } from '../../@utils/TestHelper';
import {
  projectsFixture,
  tasksFixture,
  userProjectsFixture,
  usersFixture,
} from './@fixtures/patch';

const h = new TestHelper('/projects/:projectId/tasks/:taskId/move')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture);

let projectId: number;
let taskId: number;

describe(`PATCH ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    taskId = h.entities.Task.find(el => el.title === 'task1').id;
  });
  afterAll(h.after);

  it('by guest - anauthorized error', async () => {
    await h
      .requestBy()
      .patch(h.path(projectId, taskId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by project owner', async () => {
    const { body } = await h
      .requestBy('project-owner@mail.com')
      .patch(h.path(projectId, taskId))
      .send({ status: 3 })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        status: 3,
      })
    );
  });

  it('by project member', async () => {
    const { body } = await h
      .requestBy('member@mail.com')
      .patch(h.path(projectId, taskId))
      .send({ status: 3 })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        status: 3,
      })
    );
  });

  it('by NOT project member', async () => {
    const { body } = await h
      .requestBy('not-member@mail.com')
      .patch(h.path(projectId, taskId))
      .send({ accessLevel: 3 })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });

  it('by member with WHITE access level', async () => {
    const { body } = await h
      .requestBy('access-level-white@mail.com')
      .patch(h.path(projectId, taskId))
      .send({ status: 3 })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });
});
