import { date, lorem } from 'faker';
import moment = require('moment');

import { TestHelper } from '../@utils/TestHelper';
import {
  projectsFixture,
  tasksFixture,
  userProjectsFixture,
  usersFixture,
  userWorksFixture,
} from './@fixtures/patch';

import { Task } from '../../src/@orm/task';
import { UserWork } from '../../src/@orm/user-work';

const h = new TestHelper('/user-works/:userWorkId')
  .addFixture(usersFixture)
  .addFixture(projectsFixture)
  .addFixture(userProjectsFixture)
  .addFixture(tasksFixture)
  .addFixture(userWorksFixture);

/**
 * Изменяем работу пользователя с валидацией
 */
describe(`PATCH ${h.url}`, () => {
  let projectId: number;
  let userWorkId: number;

  beforeAll(async () => {
    await h.before();
    projectId = h.entities.Project[0].id;
    userWorkId = h.entities.UserWork.find(el => el.description === 'super-admin@mail.com userWork')
      .id;
  });
  afterAll(h.after);

  it('by guest', async () => {
    await h
      .requestBy()
      .patch(h.path(userWorkId))
      .expect(401)
      .expect({
        error: 'Unauthorized',
        statusCode: 401,
      });
  });

  it('by user@mail.com without projectId', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .patch(h.path(userWorkId))
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by super-admin@mail.com with wrong projectId type', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId))
      .send({ projectId: 'asdfasdf' })
      .expect(406);
    expect(body).toEqual({
      error: 'Not Acceptable',
      message: expect.any(String),
      statusCode: 406,
    });
  });

  it('by super-admin@mail.com with wrong projectId value', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId))
      .send({ projectId: 999 })
      .expect(404);
    expect(body).toEqual({
      error: 'Not Found',
      message: expect.any(String),
      statusCode: 404,
    });
  });

  it('by exist-not-finished@mail.com with wrong projectId value', async () => {
    const { body } = await h
      .requestBy('exist-not-finished@mail.com')
      .patch(h.path(userWorkId))
      .send({ projectId: 999 })
      .expect(403);
    expect(body).toEqual({
      error: 'Forbidden',
      message: expect.any(String),
      statusCode: 403,
    });
  });

  it('by user@mail.com', async () => {
    const { body } = await h
      .requestBy('user@mail.com')
      .patch(h.path(userWorkId))
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
      .requestBy('admin@mail.com')
      .patch(h.path(userWorkId))
      .send({ projectId })
      .expect(403)
      .expect({
        error: 'Forbidden',
        message: 'Forbidden resource',
        statusCode: 403,
      });
  });

  it(
    'by owner with validation error' +
      ' (description is number, startAt string but is not date string)',
    async () => {
      const { body } = await h
        .requestBy('super-admin@mail.com')
        .patch(h.path(userWorkId))
        .send({
          description: 1,
          finishAt: '2019-07-22',
          projectId,
          source: 2,
          startAt: '2019-07-22',
          taskId: 'asdfasdfasdf',
          value: 'string',
        })
        .expect(422);
      expect(body).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({
            constraints: expect.objectContaining({
              isString: expect.any(String),
            }),
            property: 'description',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isMomentString: expect.any(String),
            }),
            property: 'finishAt',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isString: expect.any(String),
            }),
            property: 'source',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isMomentString: expect.any(String),
            }),
            property: 'startAt',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isNumber: expect.any(String),
            }),
            property: 'taskId',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isNumber: expect.any(String),
            }),
            property: 'value',
          }),
        ]),
      });
    }
  );

  it(
    'by owner with validation error' + ' (description longer then 255, startAt is number)',
    async () => {
      const { body } = await h
        .requestBy('super-admin@mail.com')
        .patch(h.path(userWorkId))
        .send({
          description: lorem.words(255),
          finishAt: 1550408502,
          projectId,
          source: lorem.words(255),
          startAt: 1550408502,
          value: {},
        })
        .expect(422);
      expect(body).toMatchObject({
        errors: expect.arrayContaining([
          expect.objectContaining({
            constraints: expect.objectContaining({
              maxLength: expect.any(String),
            }),
            property: 'description',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isMomentString: expect.any(String),
            }),
            property: 'finishAt',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              maxLength: expect.any(String),
            }),
            property: 'source',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isMomentString: expect.any(String),
            }),
            property: 'startAt',
          }),
          expect.objectContaining({
            constraints: expect.objectContaining({
              isNumber: expect.any(String),
            }),
            property: 'value',
          }),
        ]),
      });
    }
  );

  it('by owner with validation error (future dates)', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId))
      .send({
        finishAt: moment()
          .add(1, 'minutes')
          .toISOString(),
        projectId,
        startAt: moment()
          .add(1, 'minutes')
          .toISOString(),
      })
      .expect(422);
    expect(body).toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({
          constraints: expect.objectContaining({
            momentMaxDate: expect.any(String),
          }),
          property: 'finishAt',
        }),
        expect.objectContaining({
          constraints: expect.objectContaining({
            momentMaxDate: expect.any(String),
          }),
          property: 'startAt',
        }),
      ]),
    });
  });

  it('by owner with extra data', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId))
      .send({
        extraData: 'extra data',
        projectId,
      })
      .expect(422);
    expect(body).toEqual({
      errors: [
        {
          constraints: {
            whitelistValidation: 'property extraData should not exist',
          },
          property: 'extraData',
          target: expect.any(Object),
          value: 'extra data',
        },
      ],
      message: 'Validation Error',
      statusCode: 422,
    });
  });

  it('by owner with finish before start', async () => {
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId))
      .send({
        finishAt: moment()
          .subtract(2, 'minutes')
          .toISOString(),
        projectId,
        startAt: moment()
          .subtract(1, 'minutes')
          .toISOString(),
      })
      .expect(422);
    expect(body).toMatchObject({
      errors: expect.arrayContaining([
        expect.objectContaining({
          constraints: expect.objectContaining({
            laterThenField: expect.any(String),
          }),
          property: 'finishAt',
        }),
      ]),
    });
  });

  it('by owner with correct data', async () => {
    const newValue = {
      description: lorem.words(2),
      finishAt: moment()
        .subtract(2, 'minutes')
        .toISOString(),
      projectId,
      source: lorem.words(2),
      startAt: moment()
        .subtract(20, 'minutes')
        .toISOString(),
      taskId: 4,
      value: 10,
    };
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId))
      .send(newValue)
      .expect(200);
    expect(body).toEqual({
      edited: expect.objectContaining({
        description: newValue.description,
        finishAt: newValue.finishAt,
        source: newValue.source,
        startAt: newValue.startAt,
        taskId: newValue.taskId,
        value: newValue.value,
      }),
      removed: [],
      touched: [],
    });
  });

  it('by owner with correct data (without dates)', async () => {
    const userWorkId2 = h.entities.UserWork.find(
      el => el.description === 'super-admin@mail.com userWork2'
    ).id;
    const newValue = {
      description: lorem.words(2),
      finishAt: undefined,
      projectId,
      source: lorem.words(2),
      startAt: undefined,
      taskId: 4,
      value: 10,
    };
    const { body } = await h
      .requestBy('super-admin@mail.com')
      .patch(h.path(userWorkId2))
      .send(newValue)
      .expect(200);
    expect(body).toEqual({
      edited: expect.objectContaining({
        description: newValue.description,
        finishAt: expect.any(String),
        source: newValue.source,
        startAt: expect.any(String),
        taskId: newValue.taskId,
        value: newValue.value,
      }),
      removed: [],
      touched: [],
    });
  });

  it('by member with correct data (without dates)', async () => {
    const userWorkId3 = h.entities.UserWork.find(
      el => el.description === 'exist-not-finished@mail.com userWork3'
    ).id;
    const newValue = {
      description: 'New value description ha-ha',
      finishAt: moment().subtract(1, 'minutes'),
      projectId,
      source: lorem.words(2),
      startAt: moment().subtract(40, 'minutes'),
      taskId: 4,
      value: 10,
    };
    const { body } = await h
      .requestBy('exist-not-finished@mail.com')
      .patch(h.path(userWorkId3))
      .send(newValue)
      .expect(200);
    expect(body).toEqual(
      expect.objectContaining({
        edited: expect.objectContaining({
          description: newValue.description,
          finishAt: expect.any(String),
          source: newValue.source,
          startAt: expect.any(String),
          taskId: newValue.taskId,
          value: newValue.value,
        }),
        removed: expect.arrayContaining([
          expect.objectContaining({
            description: 'exist-not-finished@mail.com removed',
          }),
        ]),
        touched: expect.arrayContaining([
          expect.objectContaining({
            description: 'exist-not-finished@mail.com touched',
          }),
        ]),
      })
    );
    expect(body).not.toEqual(
      expect.objectContaining({
        removed: expect.arrayContaining([
          expect.objectContaining({
            description: newValue.description,
          }),
        ]),
      })
    );
    expect(body).not.toEqual(
      expect.objectContaining({
        touched: expect.arrayContaining([
          expect.objectContaining({
            description: newValue.description,
          }),
        ]),
      })
    );
  });
});
