import { fixtureCreator, one } from 'typeorm-fixtures';

import { Task } from '../../@orm/task';
import { User } from '../../@orm/user';
import { UserTask } from '../../@orm/user-task';

export const createUserTasks = fixtureCreator<UserTask>(UserTask, function (entity, index) {
  return {
    benefitPart: 1,
    time: 600000,
    ...entity,
    task: one(this, Task, entity.task),
    user: one(this, User, entity.user),
  };
});
