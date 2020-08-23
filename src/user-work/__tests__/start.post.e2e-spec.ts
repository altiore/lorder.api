import { STATUS_NAME } from '../../@domains/strategy';
import { Task } from '../../@orm/entities/task.entity';
import { UserProject } from '../../@orm/entities/user-project.entity';
import { UserTask } from '../../@orm/entities/user-task.entity';
import { UserWork } from '../../@orm/entities/user-work.entity';
import { TestHelper } from '../../@test-helper/@utils/TestHelper';
import {
  projectsFixture,
  tasksFixture,
  userProjectsFixture,
  usersFixture,
  userTaskFixture,
  userWorksFixture,
} from './@fixtures/post';

const h = new TestHelper('/user-works')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture)
  .addFixture(userTaskFixture);

describe(`POST ${h.url}`, () => {
  let projectId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h.requestBy().post(h.path()).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by user@mail.com without projectId', async () => {
    const { body } = await h
      .requestBy(await h.getUser('user@mail.com'))
      .post(h.path())
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by user@mail.com', async () => {
    const { body } = await h
      .requestBy(await h.getUser('user@mail.com'))
      .post(h.path())
      .send({ projectId })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403,
    });
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy(await h.getUser('admin@mail.com'))
      .post(h.path())
      .send({ projectId })
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by owner with validation error (sequenceNumber not set)', async () => {
    await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .post(h.path())
      .send({
        description: 'создана автоматически',
        projectId,
      })
      .expect(422)
      .expect({
        errors: [
          {
            children: [],
            constraints: {
              isNotEmpty: 'sequenceNumber should not be empty',
              isNumber: 'sequenceNumber must be a number conforming to the specified constraints',
            },
            property: 'sequenceNumber',
          },
        ],
        message: 'Validation Error',
        statusCode: 422,
      });
  });

  it('by owner with extra data', async () => {
    const { body } = await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .post(h.path())
      .send({
        description: 'создана автоматически',
        extraData: 'extra data',
        projectId,
        sequenceNumber: 1,
      })
      .expect(422);
    expect(body).toEqual({
      errors: [
        {
          constraints: {
            whitelistValidation: 'property extraData should not exist',
          },
          property: 'extraData',
          value: 'extra data',
        },
      ],
      message: 'Validation Error',
      statusCode: 422,
    });
  });

  it('could not start task which was already started', async () => {
    const taskInTesting = await h.findOne(Task, { title: 'STARTED BY user@mail.com' });
    await h
      .requestBy(await h.getUser('admin@mail.com'))
      .post(h.path())
      .send({
        description: 'Описание новой задачи',
        projectId,
        title: 'Задача Lorder',
        taskId: taskInTesting.id,
      })
      .expect(403);
  });

  it('could not start task which was already started', async () => {
    const taskInTesting = await h.findOne(Task, { title: 'STARTED BY user@mail.com' });
    await h
      .requestBy(await h.getUser('admin@mail.com'))
      .post(h.path())
      .send({
        description: 'Описание новой задачи',
        projectId,
        title: 'Задача Lorder',
        taskId: taskInTesting.id,
      })
      .expect(403);
  });

  it('by owner with correct data existing task with IN_TESTING status', async () => {
    const taskInTesting = await h.findOne(Task, { title: 'IN_TESTING' });
    const userId = await h.getUser('exist-not-finished@mail.com');
    const taskInfo: Partial<Task> = {
      projectId,
      sequenceNumber: taskInTesting.sequenceNumber,
    };
    expect(taskInTesting.statusTypeName).toBe(STATUS_NAME.READY_TO_DO);
    const { body } = await h
      .requestBy(userId)
      .post(h.path())
      .send({
        description: 'Описание новой задачи',
        ...taskInfo,
      })
      .expect(201);
    expect(body.started.task).toEqual(
      expect.objectContaining({
        inProgress: true,
        statusTypeName: STATUS_NAME.READY_TO_DO,
      })
    );
    const userTask = await h.findOne(UserTask, { taskId: body.finished[0].taskId, userId });
    const time = userTask?.time;
    expect(time).toBeGreaterThanOrEqual(7200000);
    expect(time).toBeLessThanOrEqual(7220000);

    const userProject = await h.findOne(UserProject, { memberId: userId, projectId });
    expect(userProject).toEqual(
      expect.objectContaining({
        valueSum: 0,
      })
    );
    const timeSum = userProject?.timeSum;
    expect(timeSum).toBeGreaterThanOrEqual(7200000);
    expect(timeSum).toBeLessThanOrEqual(7220000);

    await h.removeCreated(UserWork, { id: body.started.id });
    await h.removeCreated(Task, { id: body.started.taskId });
  });
});
