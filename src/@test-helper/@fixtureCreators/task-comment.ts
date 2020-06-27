import { fixtureCreator, one } from 'typeorm-fixtures';

import { lorem } from 'faker';

import { Task } from '../../@orm/task';
import { TaskComment } from '../../@orm/task-comment/task-comment.entity';
import { User } from '../../@orm/user';

export const createTaskComments = fixtureCreator<TaskComment>(TaskComment, function (entity, index) {
  return {
    text: lorem.lines(2),
    ...entity,
    task: one(this, Task, entity.task),
    user: one(this, User, entity.user),
  };
});
