import moment = require('moment');
import { fixtureCreator, one } from 'typeorm-fixtures';

import { TaskLog, TASK_CHANGE_TYPE } from '@orm/entities/task-log.entity';
import { Task } from '@orm/entities/task.entity';
import { User } from '@orm/entities/user.entity';

import { random } from 'faker';

export const createTaskLogs = fixtureCreator<TaskLog>(TaskLog, function (entity, index) {
  return {
    changeType: TASK_CHANGE_TYPE.UPDATE,
    createdAt: moment().subtract(1440 - index, 'minutes'),
    description: random.words(),
    prevVersion: undefined,
    ...entity,
    createdBy: one(this, User, entity.createdBy),
    task: one(this, Task, entity.task),
  };
});
