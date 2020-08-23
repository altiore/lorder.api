import { ROLE } from '../../../@domains/strategy';
import { ACCESS_LEVEL, UserProject } from '../../../@orm/entities/user-project.entity';
import { TestHelper } from '../../../@test-helper/@utils/TestHelper';
import { projectRoles, projectsFixture, roleFlows, userProjectsFixture, usersFixture } from './@fixtures/patch';

const h = new TestHelper('/projects/:projectId/members/:memberId')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(roleFlows)
  .addFixture(projectRoles);

let projectId: number;
let memberId: number;

describe(`PATCH ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    memberId = h.entities.User.find((el) => el.email === 'member@mail.com').id;
  });
  afterAll(h.after);

  it('by guest - anauthorized error', async () => {
    await h.requestBy().patch(h.path(projectId, memberId)).expect(401).expect({
      message: 'Unauthorized',
      statusCode: 401,
    });
  });

  it('by NOT project owner', async () => {
    const { body } = await h
      .requestBy(await h.getUser('not-owner@mail.com'))
      .patch(h.path(projectId, memberId))
      .send({ accessLevel: 3 })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });

  it('by project owner accessLevel only', async () => {
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .patch(h.path(projectId, memberId))
      .send({ accessLevel: ACCESS_LEVEL.YELLOW })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        accessLevel: ACCESS_LEVEL.YELLOW,
      })
    );
    const up = await h.findOne(UserProject, {
      member: { id: memberId },
      project: { id: projectId },
    });
    expect(up.accessLevel).toBe(ACCESS_LEVEL.YELLOW);
  });

  it('by project owner roles only', async () => {
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .patch(h.path(projectId, memberId))
      .send({ roles: [ROLE.ARCHITECT] })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        roles: expect.arrayContaining([
          expect.objectContaining({
            role: expect.objectContaining({
              id: ROLE.ARCHITECT,
            }),
          }),
        ]),
      })
    );

    const up = await h.findOne(UserProject, {
      relations: ['roles', 'roles.role'],
      where: {
        member: { id: memberId },
        project: { id: projectId },
      },
    });
    expect(up.roles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: expect.objectContaining({
            id: ROLE.ARCHITECT,
          }),
        }),
      ])
    );
  });

  it('by project owner replace roles', async () => {
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .patch(h.path(projectId, memberId))
      .send({ roles: [ROLE.DEVELOPER] })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        roles: expect.arrayContaining([
          expect.objectContaining({
            role: expect.objectContaining({
              id: ROLE.DEVELOPER,
            }),
          }),
        ]),
      })
    );

    const up = await h.findOne(UserProject, {
      relations: ['roles', 'roles.role'],
      where: {
        member: { id: memberId },
        project: { id: projectId },
      },
    });
    expect(up.roles.length).toBe(1);
    expect(up.roles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: expect.objectContaining({
            id: ROLE.DEVELOPER,
          }),
        }),
      ])
    );
  });

  it('by project owner not existing in project role', async () => {
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .patch(h.path(projectId, memberId))
      .send({ roles: [ROLE.DEVELOPER, ROLE.DESIGNER] })
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        roles: expect.arrayContaining([
          expect.objectContaining({
            role: expect.objectContaining({
              id: ROLE.DEVELOPER,
            }),
          }),
        ]),
      })
    );

    const up = await h.findOne(UserProject, {
      relations: ['roles', 'roles.role'],
      where: {
        member: { id: memberId },
        project: { id: projectId },
      },
    });
    expect(up.roles.length).toBe(1);
    expect(up.roles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: expect.objectContaining({
            id: 'dev-full',
          }),
        }),
      ])
    );
  });
});
