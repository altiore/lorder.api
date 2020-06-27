import { fixtureCreator, one } from 'typeorm-fixtures';

import { company, random } from 'faker';

import { Project, PROJECT_TYPE } from '../../@orm/project';
import { User } from '../../@orm/user';

export const createProjects = fixtureCreator<Project>(Project, function (entity, index) {
  return {
    monthlyBudget: random.number(100),
    title: `${company.companyName()} ${index}`,
    type: PROJECT_TYPE.SOCIALLY_USEFUL,
    ...entity,
    creator: one(this, User, entity.owner),
    owner: one(this, User, entity.owner),
    updator: one(this, User, entity.owner),
  };
});
