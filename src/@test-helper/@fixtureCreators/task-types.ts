import { random } from 'faker';
import { fixtureCreator } from 'typeorm-fixtures';

import { TaskType } from '@orm/task-type/task-type.entity';

export const createTaskTypes = fixtureCreator<TaskType>(TaskType, (entity, index) => {
  return {
    name: random.words(1),
    ...entity,
  };
});
