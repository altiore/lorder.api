import * as moment from 'moment';

import { TestHelper } from '../../@utils/TestHelper';
import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture, userTasksFixture } from './@fixtures/patch';

import { UserTask } from '../../../src/@orm/user-task';

const h = new TestHelper('/projects/:projectId/user-tasks/:userTaskId')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userTasksFixture);

describe(`PATCH ${h.url}`, async () => {
  let projectId: number;
  let notFinishedUserTaskId: number;
  let finishedUserTaskId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    notFinishedUserTaskId = h.entities.UserTask.find(el => el.task.title === 'NotFinished').id;
    finishedUserTaskId = h.entities.UserTask.find(el => el.task.title === 'Finished').id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .patch(h.path(projectId, notFinishedUserTaskId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by white-accessLevel@mail.com', async () => {
    await h
      .requestBy('white-accessLevel@mail.com')
      .patch(h.path(projectId, notFinishedUserTaskId))
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by not-invited@mail.com', async () => {
    await h
      .requestBy('not-invited@mail.com')
      .patch(h.path(projectId, notFinishedUserTaskId))
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by user@mail.com (try finish finished userTask)', async () => {
    const email = 'user@mail.com';
    const { body } = await h
      .requestBy(email)
      .patch(h.path(projectId, finishedUserTaskId))
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by user@mail.com (finishing not finished userTask)', async () => {
    const email = 'user@mail.com';
    await h
      .requestBy(email)
      .patch(h.path(projectId, notFinishedUserTaskId))
      .expect(200);
    const currentUser = h.entities.User[0];
    expect(currentUser.email).toBe(email);
    // it was not finished before
    expect(h.entities.UserTask.find(el => el.id === notFinishedUserTaskId).finishAt).toBeNull();
    const currentUserTask = await h.findOne(UserTask, { id: notFinishedUserTaskId });
    expect(currentUserTask.finishAt).toEqual(expect.any(moment));
  });
});
