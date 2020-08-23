import { fixtureCreator, one } from 'typeorm-fixtures';

import { Session } from '@orm/entities/session.entity';
import { User } from '@orm/entities/user.entity';

import { random } from 'faker';

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
