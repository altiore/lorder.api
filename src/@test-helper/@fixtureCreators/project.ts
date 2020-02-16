import { company, random } from 'faker';
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Project } from '../../@orm/project';
import { User } from '../../@orm/user';

export const createProjects = fixtureCreator<Project>(Project, function(entity, index) {
  return {
    monthlyBudget: random.number(100),
    title: `${company.companyName()} ${index}`,
    ...entity,
    creator: one(this, User, entity.owner),
    owner: one(this, User, entity.owner),
    updator: one(this, User, entity.owner),
  };
});
