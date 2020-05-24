import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture, userWorksFixture } from './@fixtures/get';

const h = new TestHelper('/projects/:projectId/statistic')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

describe(`PATCH ${h.url}`, () => {
  let projectId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .patch(h.path())
      .expect(401)
      .expect({
        message: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by owner', async () => {
    await h
      .requestBy(await h.getUser('super-admin@mail.com'))
      .patch(h.path(projectId))
      .expect(200);
  });
});
