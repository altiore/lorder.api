import { fixtureCreator } from 'typeorm-fixtures';

import { RoleFlow } from '@orm/entities/role-flow.entity';

import { random } from 'faker';

export const createRoleFlows = fixtureCreator<RoleFlow>(RoleFlow, function (entity, index) {
  return {
    name: random.words(2),
    ...entity,
  };
});
