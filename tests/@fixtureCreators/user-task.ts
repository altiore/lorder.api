import { company, date, internet, random } from 'faker';
import moment = require('moment');
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Task } from '../../src/@orm/task';
import { User } from '../../src/@orm/user';
import { UserTask } from '../../src/@orm/user-task';

export const createUserTasks = fixtureCreator<UserTask>(UserTask, function(entity, index) {
  return {
    description: random.words(3),
    finishAt: moment().add(30, 'minute'),
    source: internet.url(),
    startAt: moment(),
    value: random.number(100),
    ...entity,
    task: one(this, Task, entity.task),
    user: one(this, User, entity.user),
  };
});
