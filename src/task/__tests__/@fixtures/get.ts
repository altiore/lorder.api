import { ROLES } from '@orm/entities/role.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';

import {
  createProjects,
  createTasks,
  createUserProjects,
  createUsers,
  createUserWorks,
} from '../../../@test-helper/@fixtureCreators';

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
  {
    email: 'removed@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'white-status@mail.com',
    roles: [{ name: ROLES.USER }],
  },
]);

export const projectsFixture = createProjects([
  {
    owner: { email: 'super-admin@mail.com' },
  },
]);

export const userProjectFixture = createUserProjects([
  {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'user@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.WHITE,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'white-status@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
  },
]);

export const tasksFixture = createTasks([
  {
    performer: { email: 'user@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
    status: 2,
    title: 'First Task',
    userTasks: [{ user: { email: 'user@mail.com' } }],
  },
  {
    performer: { email: 'removed@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
    status: 2,
    title: 'Second Task',
    userTasks: [{ user: { email: 'removed@mail.com' } }],
  },
  {
    performer: { email: 'white-status@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
    status: 2,
    title: 'Third Task',
    userTasks: [{ user: { email: 'white-status@mail.com' } }],
  },
]);

export const userWorksFixture = createUserWorks([
  {
    task: { title: 'First Task' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'First Task' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'First Task' },
    user: { email: 'user@mail.com' },
  },
]);
