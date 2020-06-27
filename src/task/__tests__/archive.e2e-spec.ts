import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture } from './@fixtures/archive';

const h = new TestHelper('/tasks/:taskId/archive')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture);

let taskId: number;
let alreadyArchivedTaskId: number;

describe(`PATCH ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();

    taskId = h.entities.Task.find((el) => el.title === 'task1').id;
    alreadyArchivedTaskId = h.entities.Task.find((el) => el.title === 'already-archived').id;
  });

  it('by guest - an authentication error', async () => {
    await h.requestBy().patch(h.path(taskId)).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by non task owner - an authentication error', async () => {
    await h
      .requestBy(await h.getUser('non-task-owner@mail.com'))
      .patch(h.path(taskId))
      .expect(404);
  });

  it('archive already archived task - not found error', async () => {
    await h
      .requestBy(await h.getUser('task-owner@mail.com'))
      .patch(h.path(alreadyArchivedTaskId))
      .expect(404);
  });

  it('by task owner', async () => {
    const { body } = await h
      .requestBy(await h.getUser('task-owner@mail.com'))
      .patch(h.path(taskId))
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        isArchived: true,
      })
    );
  });

  afterAll(h.after);
});
