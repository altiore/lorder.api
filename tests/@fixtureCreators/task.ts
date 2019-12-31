import { company, random } from 'faker';
import { fixtureCreator, many, one } from 'typeorm-fixtures';

import { Project } from '../../src/@orm/project';
import { Task } from '../../src/@orm/task';
import { User } from '../../src/@orm/user';

export const createTasks = fixtureCreator<Task>(Task, function(entity, index) {
  return {
    description: random.words(5),
    sequenceNumber: index,
    status: 0,
    title: company.companyName(),
    value: random.number(100),
    ...entity,
    performer: entity.performer ? one(this, User, entity.performer) : undefined,
    project: one(this, Project, entity.project),
    users: many(this, User, entity.users),
  };
});
