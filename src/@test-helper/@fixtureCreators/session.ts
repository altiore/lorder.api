import { fixtureCreator, one } from 'typeorm-fixtures';

import { random } from 'faker';

import { Session } from '../../@orm/session/session.entity';
import { User } from '../../@orm/user';

export const createSessionFixture = fixtureCreator<Session>(Session, function (entity, index) {
  return {
    userAgent: 'node-superagent/3.8.3',
    referer: 'no referer',
    acceptLanguage: 'en',
    device: 'common',
    refreshToken: random.words(1),
    headers: { test: 'Test' },
    ...entity,
    user: one(this, User, entity.user),
  };
});
