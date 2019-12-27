import { TestHelper } from '../../../@utils/TestHelper';
import {
  projectsFixture,
  taskLogsFixture,
  tasksFixture,
  userProjectFixture,
  usersFixture,
  userWorksFixture,
} from './@fixtures/get';

const h = new TestHelper('/projects/:projectId/tasks/:taskId/task-logs')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectFixture)
  .addFixture(tasksFixture)
  .addFixture(taskLogsFixture)
  .addFixture(userWorksFixture);

let projectId: number;
let taskId: number;

describe(`GET ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project.find(el => el.owner.email === 'super-admin@mail.com').id;
    taskId = h.entities.Task.find(el => el.title === 'First Task').id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .get(h.path(projectId, taskId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('try to get task-logs from forbidden project', async () => {
    const forbiddenProjectId = h.entities.Project.find(
      el => el.owner.email === 'unknown-other-user@mail.com'
    ).id;
    await h
      .requestBy('user@mail.com')
      .get(h.path(forbiddenProjectId, taskId))
      .expect(403);
  });

  it('try to get task-logs from wrong task', async () => {
    const wrongTaskId = h.entities.Task.find(el => el.title === 'Fourth Task').id;
    await h
      .requestBy('user@mail.com')
      .get(h.path(projectId, wrongTaskId))
      .expect(406);
  });

  it('last 1 item by correct user', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .get(h.path(projectId, taskId))
      .query({
        count: 1,
      })
      .expect(200);
    expect(body.length).toEqual(1);
  });

  // должны получить следующий 2 элемента при условии, что у нас нет самого последнего.
  // Т.е. должны получить самый последний, и следующий после имеющихся
  it('last 2 item by correct user and was created one more last item', async () => {
    const startId = h.entities.TaskLog.find(el => el.description === '2').id;
    const endId = h.entities.TaskLog.find(el => el.description === '3').id;
    expect(endId).toBe(3);
    const { body } = await h
      .requestBy('user@mail.com')
      .get(h.path(projectId, taskId))
      .query({
        count: 2,
        endId,
        startId,
      })
      .expect(200);
    expect(body.length).toEqual(2);

    expect(body).toEqual([
      expect.objectContaining({
        description: '1',
      }),
      expect.objectContaining({
        description: '4',
      }),
    ]);
  });
});
