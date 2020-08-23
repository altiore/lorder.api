import { TaskComment } from '@orm/entities/task-comment.entity';

import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import {
  projectsFixture,
  taskCommentsFixture,
  tasksFixture,
  userProjectsFixture,
  usersFixture,
} from './@fixtures/post';

const h = new TestHelper('/projects/:projectId/tasks/:taskId/comments')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(taskCommentsFixture);

let projectId: number;
let taskId: number;

describe(`POST ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    taskId = h.entities.Task[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h.requestBy().post(h.path(projectId, taskId)).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by white-level@mail.com', async () => {
    await h
      .requestBy(await h.getUser('white-level@mail.com'))
      .post(h.path(projectId, taskId))
      .expect(403);
  });

  it('by member@mail.com RED level', async () => {
    await h
      .requestBy(await h.getUser('member@mail.com'))
      .post(h.path(projectId, taskId))
      .expect(403);
  });

  it('by yellow@mail.com YELLOW level', async () => {
    await h
      .requestBy(await h.getUser('yellow@mail.com'))
      .post(h.path(projectId, taskId))
      .expect(422);
  });

  it('by project-owner@mail.com Empty data', async () => {
    await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .post(h.path(projectId, taskId))
      .expect(422);
  });

  it('by project-owner@mail.com correct data', async () => {
    const text = 'New Title';
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .post(h.path(projectId, taskId))
      .send({ text })
      .expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        text,
      })
    );

    await h.removeCreated(TaskComment, { id: body.id });
  });

  it('by yellow@mail.com with correct data', async () => {
    const text = 'New Title';
    const { body } = await h
      .requestBy(await h.getUser('yellow@mail.com'))
      .post(h.path(projectId, taskId))
      .send({ text })
      .expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        text,
      })
    );

    await h.removeCreated(TaskComment, { id: body.id });
  });
});
