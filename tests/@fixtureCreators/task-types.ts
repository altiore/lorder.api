import { internet, random } from 'faker';
import { fixtureCreator } from 'typeorm-fixtures';

import { TaskType } from '@orm/task-type/task-type.entity';

export const createTaskTypes = fixtureCreator<TaskType>(TaskType, (entity, index) => {
  return {
    color: internet.color(),
    icon: random.words(1),
    title: random.words(2),
    ...entity,
  };
});
