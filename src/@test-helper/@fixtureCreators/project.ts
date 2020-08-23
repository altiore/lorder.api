import { fixtureCreator, one } from 'typeorm-fixtures';

import { Project, PROJECT_TYPE } from '@orm/entities/project.entity';
import { User } from '@orm/entities/user.entity';

import { company, random } from 'faker';

import { TASK_FLOW_STRATEGY } from '../../@domains/strategy';

export const createProjects = fixtureCreator<Project>(Project, function (entity, index) {
  return {
    monthlyBudget: random.number(100),
    title: `${company.companyName()} ${index}`,
    type: PROJECT_TYPE.SOCIALLY_USEFUL,
    strategy: TASK_FLOW_STRATEGY.SIMPLE,
    ...entity,
    creator: one(this, User, entity.owner),
    owner: one(this, User, entity.owner),
    updator: one(this, User, entity.owner),
  };
});
