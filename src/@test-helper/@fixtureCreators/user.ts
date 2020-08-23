import { fixtureCreator, many } from 'typeorm-fixtures';

import { Role } from '@orm/entities/role.entity';
import { UserRole } from '@orm/entities/user-role.entity';
import { User } from '@orm/entities/user.entity';

import { name } from 'faker';

export const createUsers = fixtureCreator<User>(User, function (entity, index) {
  return {
    displayName: name.firstName() + name.lastName(),
    email: `test${index}@mail.com`,
    status: User.ACTIVATED,
    ...entity,
    userRoles: many(this, Role, entity.roles).map((role) => {
      const m = new UserRole();
      m.role = role;
      return m;
    }),
  };
});
