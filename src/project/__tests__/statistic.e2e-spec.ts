import { ACCESS_LEVEL } from '../../@orm/user-project';
import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture, userWorksFixture } from './@fixtures/get';

const h = new TestHelper('/projects/:projectId/statistic')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

describe(`GET ${h.url}`, () => {
  let projectId: number;
  let memberId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    memberId = h.entities.User.find(user => user.email === 'user@mail.com').id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .patch(h.path())
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by owner', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(projectId))
      .expect(200);
    expect(body).toEqual({
      data: {
        [memberId]: {
          time: expect.any(Number),
          value: expect.any(Number),
        },
      },
      members: [
        {
          accessLevel: ACCESS_LEVEL.WHITE,
          avatar: null,
          email: expect.any(String),
          id: memberId,
        },
      ],
    });
  });
});
