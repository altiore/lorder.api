import { ProjectRole } from '../../../src/@orm/project-role';
import { TestHelper } from '../../@utils/TestHelper';
import { projectsFixture, userProjectFixture, usersFixture } from './@fixtures/post';

const h = new TestHelper('/projects/:projectId/roles')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectFixture);

let projectId: number;

const correctWorkflow = { test: 1 };

describe(`GET ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project.find(el => el.title === 'Test User is Owner').id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .post(h.path(projectId))
      .send({
        roleId: 11,
        workFlow: correctWorkflow,
      })
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by test@mail.com to alien project', async () => {
    const alienProjectId = h.entities.Project.find(el => el.title === 'Admin is Owner').id;
    await h
      .requestBy('test@mail.com')
      .post(h.path(alienProjectId))
      .send({
        roleId: 11,
        workFlow: correctWorkflow,
      })
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by test@mail.com to own project with roleId validation error', async () => {
    await h
      .requestBy('test@mail.com')
      .post(h.path(projectId))
      .send({
        roleId: 'string',
        workFlow: correctWorkflow,
      })
      .expect(422);
  });

  it('by test@mail.com to own project with workFlow validation error', async () => {
    await h
      .requestBy('test@mail.com')
      .post(h.path(projectId))
      .send({
        roleId: 'string',
        workFlow: {},
      })
      .expect(422);
  });

  it('by test@mail.com to own project', async () => {
    const { body } = await h
      .requestBy('test@mail.com')
      .post(h.path(projectId))
      .send({
        roleId: 11,
        workFlow: correctWorkflow,
      })
      .expect(201);

    await h.removeCreated(ProjectRole, { role: body.role, project: body.project });
  });
});
