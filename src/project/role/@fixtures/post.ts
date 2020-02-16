import { createProjects, createRoleFlows, createUserProjects, createUsers } from '../../../../tests/@fixtureCreators';
import { ROLES } from '../../../@orm/role';
import { ACCESS_LEVEL } from '../../../@orm/user-project';

export const rolesFixture = createRoleFlows([{ id: 'dev-full' }, { id: 'creator' }, { id: 'qa' }]);

export const usersFixture = createUsers([
  {
    email: 'test@mail.com',
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
    owner: { email: 'test@mail.com' },
    title: 'Test User is Owner',
  },
  {
    owner: { email: 'admin@mail.com' },
    title: 'Admin is Owner',
  },
  {
    owner: { email: 'super-admin@mail.com' },
    title: 'Super Admin is Owner',
  },
]);

export const userProjectFixture = createUserProjects([
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'test@mail.com' },
    member: { email: 'test@mail.com' },
    project: { owner: { email: 'test@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'admin@mail.com' },
    member: { email: 'admin@mail.com' },
    project: { owner: { email: 'admin@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'super-admin@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
]);
