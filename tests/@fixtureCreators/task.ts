import { company, date, internet, random } from 'faker';
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Project } from '../../src/@orm/project';
import { Task } from '../../src/@orm/task';

export const createTasks = fixtureCreator<Task>(Task, function(entity, index) {
  return {
    description: random.words(5),
    title: company.companyName(),
    value: random.number(100),
    ...entity,
    project: one(this, Project, entity.project),
  };
});
