import { name } from 'faker';
import { fixtureCreator, many } from 'typeorm-fixtures';

import { Role } from '../../@orm/role';
import { User } from '../../@orm/user';
import { UserRole } from '../../@orm/user-role/user-role.entity';

export const createUsers = fixtureCreator<User>(User, function(entity, index) {
  return {
    displayName: name.firstName() + name.lastName(),
    email: `test${index}@mail.com`,
    status: User.ACTIVATED,
    ...entity,
    userRoles: many(this, Role, entity.roles).map(role => {
      const m = new UserRole();
      m.role = role;
      return m;
    }),
  };
});
