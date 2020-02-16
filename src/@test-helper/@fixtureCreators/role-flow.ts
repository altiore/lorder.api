import { random } from 'faker';
import { fixtureCreator } from 'typeorm-fixtures';

import { RoleFlow } from '../../@orm/role-flow';

export const createRoleFlows = fixtureCreator<RoleFlow>(RoleFlow, function(entity, index) {
  return {
    name: random.words(2),
    ...entity,
  };
});
