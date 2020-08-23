import { fixtureCreator, one } from 'typeorm-fixtures';

import { Task } from '@orm/entities/task.entity';
import { UserTask } from '@orm/entities/user-task.entity';
import { User } from '@orm/entities/user.entity';

export const createUserTasks = fixtureCreator<UserTask>(UserTask, function (entity, index) {
  return {
    benefitPart: 1,
    time: 600000,
    ...entity,
    task: one(this, Task, entity.task),
    user: one(this, User, entity.user),
  };
});
