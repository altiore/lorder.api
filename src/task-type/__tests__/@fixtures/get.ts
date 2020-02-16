import { ROLES } from '../../../@orm/role';
import { createTaskTypes, createUsers } from '../../../@test-helper/@fixtureCreators';

export const usersFixture = createUsers([
  {
    email: 'user@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'admin@mail.com',
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }],
  },
  {
    email: 'super-admin@mail.com',
    roles: [{ name: ROLES.USER }, { name: ROLES.ADMIN }, { name: ROLES.SUPER_ADMIN }],
  },
]);

export const taskTypesFixtures = createTaskTypes([
  {
    title: 'First type',
  },
  {
    title: 'Second type',
  },
  {
    title: 'Third type',
  },
]);
