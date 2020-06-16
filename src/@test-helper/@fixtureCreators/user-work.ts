import moment = require('moment');
import { fixtureCreator, one } from 'typeorm-fixtures';

import { internet, random } from 'faker';

import { Task } from '../../@orm/task';
import { User } from '../../@orm/user';
import { UserWork } from '../../@orm/user-work';

export const createUserWorks = fixtureCreator<UserWork>(UserWork, function(entity, index) {
  return {
    description: random.words(3),
    finishAt: moment(),
    source: internet.url(),
    startAt: moment().subtract('30', 'minutes'),
    value: random.number(100),
    ...entity,
    task: one(this, Task, entity.task),
    user: one(this, User, entity.user),
  };
});
