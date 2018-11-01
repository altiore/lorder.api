import { ACCESS_LEVEL } from '../../src/@orm/user-project';
import { TestHelper } from '../@utils/TestHelper';
import { projectsFixture, tasksFixture, userProjectsFixture, usersFixture, userWorksFixture } from './@fixtures/get';

const h = new TestHelper('/projects')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

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
      .get(h.path())
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .get(h.path())
      .expect(200);
    expect(body).toEqual(
      expect.arrayContaining([
        /* tslint:disable */
        // toBeWithinRange implemented in import { TestHelper } from '../@utils/TestHelper';
        expect.objectContaining({
          title: 'First',
          valueSum: 44,
          timeSum: expect.toBeWithinRange(30 * 6 * 60 - 1, 30 * 6 * 60 + 1),
          accessLevel: ACCESS_LEVEL.WHITE,
        }),
        expect.objectContaining({
          title: 'Third',
          valueSum: 1,
          timeSum: expect.toBeWithinRange(30 * 60 - 1, 30 * 60 + 1),
          accessLevel: ACCESS_LEVEL.WHITE,
        }),
        expect.objectContaining({ title: 'Fourth', valueSum: 0, timeSum: 0, accessLevel: ACCESS_LEVEL.RED }),
      ])
    );
    expect(body).not.toEqual(expect.arrayContaining([expect.objectContaining({ title: 'Second' })]));
  });
});
