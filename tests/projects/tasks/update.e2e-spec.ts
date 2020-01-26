import { TestHelper } from '../../@utils/TestHelper';

import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture } from './@fixtures/update';

const h = new TestHelper('/projects/:projectId/tasks/:sequenceNumber')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture);

let projectId: number;
let taskSequenceNumber: number;

describe(`UPDATE ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    taskSequenceNumber = h.entities.Task.find(el => el.title === 'task1').sequenceNumber;
  });
  afterAll(h.after);

  it('by guest - anauthorized error', async () => {
    await h
      .requestBy()
      .patch(h.path(projectId, taskSequenceNumber))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by project owner', async () => {
    const { body } = await h
      .requestBy('project-owner@mail.com')
      .patch(h.path(projectId, taskSequenceNumber))
      .send({ title: 'Title Changed By Owner' })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        title: 'Title Changed By Owner',
      })
    );
  });

  it('by project member with status less then YELLOW', async () => {
    const taskNumber = h.entities.Task.find(el => el.title === 'performer IS NOT current user').sequenceNumber;
    await h
      .requestBy('member@mail.com')
      .patch(h.path(projectId, taskNumber))
      .send({ title: 'New Title' })
      .expect(403);
  });

  it('by project member', async () => {
    const { body } = await h
      .requestBy('member@mail.com')
      .patch(h.path(projectId, taskSequenceNumber))
      .send({ title: 'New Title' })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        title: 'New Title',
      })
    );
  });

  it('by NOT project member', async () => {
    const { body } = await h
      .requestBy('not-member@mail.com')
      .patch(h.path(projectId, taskSequenceNumber))
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
      .patch(h.path(projectId, taskSequenceNumber))
      .send({ title: 'New Title' })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });

  it('try to edit archived task by member', async () => {
    const taskNumber = h.entities.Task.find(el => el.title === 'archived task').sequenceNumber;
    await h
      .requestBy('member@mail.com')
      .patch(h.path(projectId, taskNumber))
      .send({ title: 'New Title' })
      .expect(406);
  });

  it('try to edit finished task by member', async () => {
    const taskNumber = h.entities.Task.find(el => el.title === 'finished task').sequenceNumber;
    await h
      .requestBy('member@mail.com')
      .patch(h.path(projectId, taskNumber))
      .send({ title: 'New Title' })
      .expect(406);
  });
});
