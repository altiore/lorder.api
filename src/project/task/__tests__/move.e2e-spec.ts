import { TestHelper } from '../../../@test-helper/@utils/TestHelper';
import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture } from './@fixtures/move';

const h = new TestHelper('/projects/:projectId/tasks/:sequenceNumber/move')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture);

let projectId: number;
let taskSequenceNumber: number;

describe(`PATCH (MOVE) ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    taskSequenceNumber = h.entities.Task.find((el) => el.title === 'task1').sequenceNumber;
  });
  afterAll(h.after);

  it('by guest - anauthorized error', async () => {
    await h.requestBy().patch(h.path(projectId, taskSequenceNumber)).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by project owner', async () => {
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .patch(h.path(projectId, taskSequenceNumber))
      .send({ statusTypeName: 'testing' })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        statusTypeName: 'testing',
      })
    );
  });

  it('by project member', async () => {
    const { body } = await h
      .requestBy(await h.getUser('member@mail.com'))
      .patch(h.path(projectId, taskSequenceNumber))
      .send({ statusTypeName: 'testing' })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        statusTypeName: 'testing',
      })
    );
  });

  it('by NOT project member', async () => {
    const { body } = await h
      .requestBy(await h.getUser('not-member@mail.com'))
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
      .requestBy(await h.getUser('access-level-white@mail.com'))
      .patch(h.path(projectId, taskSequenceNumber))
      .send({ statusTypeName: 'testing' })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });
});
