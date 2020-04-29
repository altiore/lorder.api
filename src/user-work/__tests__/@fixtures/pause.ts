import {
  createProjects,
  createTasks,
  createUserProjects,
  createUsers,
  createUserWorks,
} from '../../../@test-helper/@fixtureCreators';

import { ROLES } from '../../../@orm/role';
import { ACCESS_LEVEL } from '../../../@orm/user-project';

export const usersFixture = createUsers([
  {
    email: 'user@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'not-invited@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'white-accessLevel@mail.com',
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

export const userProjectsFixture = createUserProjects([
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'super-admin@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.WHITE,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'white-accessLevel@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'user@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
]);

export const tasksFixture = createTasks([
  {
    project: { owner: { email: 'super-admin@mail.com' } },
    title: 'NotFinished',
  },
  {
    project: { owner: { email: 'super-admin@mail.com' } },
    title: 'Finished',
  },
  {
    project: { owner: { email: 'super-admin@mail.com' } },
    title: 'Third',
  },
]);

export const userWorksFixture = createUserWorks([
  {
    finishAt: undefined,
    task: { title: 'NotFinished' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'Finished' },
    user: { email: 'user@mail.com' },
  },
]);
