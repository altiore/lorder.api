import { ROLES } from '../../../../src/@orm/role';
import { ACCESS_LEVEL } from '../../../../src/@orm/user-project';
import { createProjects, createUserProjects, createUsers } from '../../../@fixtureCreators';

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
