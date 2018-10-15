import { TestHelper } from '../../@utils/TestHelper';
import { projectsFixture, usersFixture } from './@fixtures';

const h = new TestHelper('/projects/:projectId/user-tasks').addFixture(usersFixture).addFixture(projectsFixture);

describe(`GET ${h.url}`, async () => {
  let projectId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .get(h.path(projectId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com', async () => {
    await h
      .requestBy('user@mail.com')
      .get(h.path(projectId))
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by admin@mail.com', async () => {
    await h
      .requestBy('admin@mail.com')
      .get(h.path(projectId))
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it('by owner', async () => {
    await h
      .requestBy('super-admin@mail.com')
      .get(h.path(projectId))
      .expect(200)
      .expect([]);
  });
});
