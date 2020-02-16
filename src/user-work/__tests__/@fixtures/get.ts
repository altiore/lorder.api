import { createProjects, createUsers } from '../../../../tests/@fixtureCreators';
import { ROLES } from '../../../@orm/role';

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

export const projectsFixture = createProjects([
  {
    owner: { email: 'super-admin@mail.com' },
  },
]);
