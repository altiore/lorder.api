import { ROLES } from '../../../@orm/entities/role.entity';
import { ACCESS_LEVEL } from '../../../@orm/entities/user-project.entity';
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
]);

export const projectsFixture = createProjects([
  {
    owner: { email: 'super-admin@mail.com' },
    title: 'First',
  },
  {
    owner: { email: 'super-admin@mail.com' },
    title: 'Second',
  },
  {
    owner: { email: 'super-admin@mail.com' },
    title: 'Third',
  },
  {
    owner: { email: 'super-admin@mail.com' },
    title: 'Fourth',
  },
]);

export const userProjectsFixture = createUserProjects([
  {
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'user@mail.com' },
    project: { title: 'First' },
  },
  {
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'user@mail.com' },
    project: { title: 'Third' },
  },
  {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'user@mail.com' },
    project: { title: 'Fourth' },
  },
]);

export const tasksFixture = createTasks([
  {
    project: { title: 'First' },
    title: 'First Project, task 1',
    userTasks: [{ user: { email: 'user@mail.com' } }],
    value: 10,
  },
  {
    project: { title: 'First' },
    title: 'First Project, task 2',
    userTasks: [{ user: { email: 'user@mail.com' } }],
    value: 14,
  },
  {
    project: { title: 'First' },
    title: 'First Project, task 3',
    userTasks: [{ user: { email: 'user@mail.com' } }],
    value: 20,
  },

  {
    project: { title: 'Third' },
    title: 'Third Project, task 1',
    userTasks: [{ user: { email: 'user@mail.com' } }],
    value: 1,
  },

  {
    project: { title: 'Fourth' },
    title: 'Fourth Project, task 1',
    userTasks: [{ user: { email: 'user@mail.com' } }],
    value: null,
  },
]);

export const userWorksFixture = createUserWorks([
  {
    task: { title: 'First Project, task 1' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'First Project, task 1' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'First Project, task 1' },
    user: { email: 'user@mail.com' },
  },

  {
    task: { title: 'First Project, task 2' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'First Project, task 2' },
    user: { email: 'user@mail.com' },
  },
  {
    task: { title: 'First Project, task 2' },
    user: { email: 'user@mail.com' },
  },

  {
    task: { title: 'Third Project, task 1' },
    user: { email: 'user@mail.com' },
  },
  {
    finishAt: null,
    task: { title: 'Third Project, task 1' },
    user: { email: 'user@mail.com' },
  },

  {
    finishAt: null,
    task: { title: 'Fourth Project, task 1' },
    user: { email: 'user@mail.com' },
  },
]);
