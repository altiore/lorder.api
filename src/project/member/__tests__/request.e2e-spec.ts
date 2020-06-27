import { ROLE } from '../../../@domains/strategy';
import { UserProject } from '../../../@orm/user-project';
import { TestHelper } from '../../../@test-helper/@utils/TestHelper';
import { projectRoles, projectsFixture, roleFlows, userProjectsFixture, usersFixture } from './@fixtures/request';

const h = new TestHelper('/projects/:projectId/members/request')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(roleFlows)
  .addFixture(projectRoles);

let projectId: number;

describe(`POST ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
  });
  afterAll(h.after);

  it('by guest - anauthorized error', async () => {
    await h.requestBy().post(h.path(projectId)).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by project owner', async () => {
    await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .post(h.path(projectId))
      .send({ role: ROLE.DESIGNER })
      .expect(406);
  });

  it('by project member', async () => {
    await h
      .requestBy(await h.getUser('member@mail.com'))
      .post(h.path(projectId))
      .send({ role: ROLE.DESIGNER })
      .expect(406);
  });

  it('by NEW member incorrect role', async () => {
    await h
      .requestBy(await h.getUser('not-member@mail.com'))
      .post(h.path(projectId))
      .send({ role: ROLE.DESIGNER })
      .expect(422);
  });

  it('by NEW member CORRECT ROLE', async () => {
    const notMemberId = await h.getUser('not-member@mail.com');
    const { body } = await h.requestBy(notMemberId).post(h.path(projectId)).send({ role: ROLE.DEVELOPER }).expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        accessLevel: -1,
        member: expect.objectContaining({
          id: notMemberId,
        }),
      })
    );

    await h.removeCreated(UserProject, { member: { id: notMemberId } });
  });
});
