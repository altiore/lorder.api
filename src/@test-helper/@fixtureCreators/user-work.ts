import moment = require('moment');
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Task } from '@orm/entities/task.entity';
import { UserWork } from '@orm/entities/user-work.entity';
import { User } from '@orm/entities/user.entity';

import { internet, random } from 'faker';

export const createUserWorks = fixtureCreator<UserWork>(UserWork, function (entity, index) {
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
