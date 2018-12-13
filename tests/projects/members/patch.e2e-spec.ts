import { TestHelper } from '../../@utils/TestHelper';
import { projectsFixture, userProjectsFixture, usersFixture } from './@fixtures/patch';

const h = new TestHelper('/projects/:projectId/members/:memberId')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture);

let projectId: number;
let memberId: number;

describe(`PATCH ${h.url}`, async () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    memberId = h.entities.User.find(el => el.email === 'member@mail.com').id;
  });
  afterAll(h.after);

  it('by guest - anauthorized error', async () => {
    await h
      .requestBy()
      .patch(h.path(projectId, memberId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by project owner', async () => {
    const { body } = await h
      .requestBy('project-owner@mail.com')
      .patch(h.path(projectId, memberId))
      .send({ accessLevel: 3 })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        accessLevel: 3,
      })
    );
  });

  it('by NOT project owner', async () => {
    const { body } = await h
      .requestBy('not-owner@mail.com')
      .patch(h.path(projectId, memberId))
      .send({ accessLevel: 3 })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });
});
