import { ROLES } from '../../../src/@orm/role';
import { createProjects, createTasks, createUsers, createUserWorks } from '../../@fixtureCreators';

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

export const tasksFixture = createTasks([
  {
    project: { owner: { email: 'super-admin@mail.com' } },
    title: 'First Task',
    users: [{ email: 'user@mail.com' }],
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
