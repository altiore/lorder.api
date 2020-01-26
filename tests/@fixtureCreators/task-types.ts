import { internet, random } from 'faker';
import { fixtureCreator } from 'typeorm-fixtures';

import { TaskType } from '../../src/@orm/task-type';

export const createTaskTypes = fixtureCreator<TaskType>(TaskType, (entity, index) => {
  return {
    color: internet.color(),
    icon: random.words(1),
    title: random.words(2),
    ...entity,
  };
});
