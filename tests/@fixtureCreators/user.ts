import { name } from 'faker';
import { fixtureCreator, many } from 'typeorm-fixtures';

import { Role } from '../../src/@orm/role';
import { User } from '../../src/@orm/user';

export const createUsers = fixtureCreator<User>(User, function(entity, index) {
  return {
    displayName: name.firstName() + name.lastName(),
    email: `test${index}@mail.com`,
    status: 10,
    ...entity,
    roles: many(this, Role, entity.roles),
  };
});
