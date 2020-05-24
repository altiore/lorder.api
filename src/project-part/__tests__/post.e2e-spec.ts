import { ProjectPart } from '../../@orm/project-part/project-part.entity';
import { TestHelper } from '../../@test-helper/@utils/TestHelper';

import { projectParts, projectsFixture, userProjectsFixture, usersFixture } from './@fixtures/get';

const h = new TestHelper('/projects/:projectId/parts')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(projectParts);

let projectId: number;

describe(`POST ${h.url}`, () => {
  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .post(h.path(projectId))
      .expect(401)
      .expect({
        message: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by white-level@mail.com', async () => {
    await h
      .requestBy(await h.getUser('white-level@mail.com'))
      .post(h.path(projectId))
      .expect(403);
  });

  it('by member@mail.com RED level', async () => {
    await h
      .requestBy(await h.getUser('member@mail.com'))
      .post(h.path(projectId))
      .expect(403);
  });

  it('by not-owner@mail.com INDIGO level', async () => {
    await h
      .requestBy(await h.getUser('not-owner@mail.com'))
      .post(h.path(projectId))
      .expect(403);
  });

  it('by project-owner@mail.com Empty data', async () => {
    await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .post(h.path(projectId))
      .expect(422);
  });

  it('by project-owner@mail.com correct data', async () => {
    const title = 'New Title';
    const { body } = await h
      .requestBy(await h.getUser('project-owner@mail.com'))
      .post(h.path(projectId))
      .send({ title })
      .expect(201);

    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        title,
      })
    );

    await h.removeCreated(ProjectPart, { id: body.id });
  });
});
