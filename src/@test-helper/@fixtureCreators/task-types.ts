import { fixtureCreator } from 'typeorm-fixtures';

import { TaskType } from '@orm/entities/task-type.entity';

import { random } from 'faker';

export const createTaskTypes = fixtureCreator<TaskType>(TaskType, (entity, index) => {
  return {
    name: random.words(1),
    ...entity,
  };
});
