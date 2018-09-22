import { intersectionWith, isMatch } from 'lodash';
import { fixtureCreator, relation } from 'typeorm-fixtures';

import { Role } from '../../src/@orm/role';
import { User } from '../../src/@orm/user';

export const createUsers = fixtureCreator<User>(User, function(entity, index) {
  const roles = entity.roles;
  return {
    email: `test${index}@mail.com`,
    status: 10,
    ...entity,
    // roles: relation(this, Role, entity.roles),
    roles: (this.Role && roles ? intersectionWith(this.Role, roles, isMatch) : this.Role || []) as Role[],
  };
});
