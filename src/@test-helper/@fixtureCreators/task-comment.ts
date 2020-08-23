import { fixtureCreator, one } from 'typeorm-fixtures';

import { User } from '@orm/entities/user.entity';

import { lorem } from 'faker';

import { TaskComment } from '../../@orm/entities/task-comment.entity';
import { Task } from '../../@orm/entities/task.entity';

export const createTaskComments = fixtureCreator<TaskComment>(TaskComment, function (entity, index) {
  return {
    text: lorem.lines(2),
    ...entity,
    task: one(this, Task, entity.task),
    user: one(this, User, entity.user),
  };
});
