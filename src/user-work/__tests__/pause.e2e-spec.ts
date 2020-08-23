import * as moment from 'moment';

import { Task } from '@orm/entities/task.entity';
import { UserWork } from '@orm/entities/user-work.entity';

import { STATUS_NAME } from '../../@domains/strategy';
import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture, userWorksFixture } from './@fixtures/pause';

const h = new TestHelper('/user-works/:userTaskId/pause')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

describe(`PATCH ${h.url}`, () => {
  let notFinishedUserWorkId: number;
  let finishedUserWorkId: number;

  beforeAll(async () => {
    await h.before();
    notFinishedUserWorkId = h.entities.UserWork.find((el) => el.task.title === 'NotFinished').id;
    finishedUserWorkId = h.entities.UserWork.find((el) => el.task.title === 'Finished').id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h.requestBy().patch(h.path(notFinishedUserWorkId)).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by white-accessLevel@mail.com', async () => {
    const { body } = await h
      .requestBy(await h.getUser('white-accessLevel@mail.com'))
      .patch(h.path(notFinishedUserWorkId))
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });

  it('by not-invited@mail.com', async () => {
    const { body } = await h
      .requestBy(await h.getUser('not-invited@mail.com'))
      .patch(h.path(notFinishedUserWorkId))
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });

  it('by user@mail.com (try finish finished userTask)', async () => {
    const email = 'user@mail.com';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.path(finishedUserWorkId))
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by user@mail.com (finishing not finished userTask)', async () => {
    const email = 'user@mail.com';
    const { body } = await h
      .requestBy(await h.getUser(email))
      .patch(h.path(notFinishedUserWorkId))
      .expect(200);
    expect(body).toEqual({
      next: expect.any(Object),
      previous: expect.any(Object),
    });
    const currentUser = h.entities.User[0];
    expect(currentUser.email).toBe(email);
    // it was not finished before
    expect(h.entities.UserWork.find((el) => el.id === notFinishedUserWorkId).finishAt).toBeNull();
    const currentUserWork = await h.findOne(UserWork, { id: notFinishedUserWorkId });
    expect(currentUserWork.finishAt).toEqual(expect.any(moment));
    expect(body.next).toMatchObject({
      finishAt: null,
      startAt: expect.any(String),
    });
    expect(body.next.startAt).toBe(currentUserWork.finishAt.toJSON());
    expect(body.next.prevTaskId).toBe(currentUserWork.taskId);
    expect(body.previous.task.statusTypeName).toBe(STATUS_NAME.READY_TO_DO);
    await h.removeCreated(Task, body.next.task.id);
    await h.removeCreated(UserWork, body.next.id);
  });
});
