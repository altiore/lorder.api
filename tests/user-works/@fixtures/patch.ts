import moment = require('moment');

import { createProjects, createTasks, createUserProjects, createUsers, createUserWorks } from '../../@fixtureCreators';

import { ROLES } from '../../../src/@orm/role';
import { ACCESS_LEVEL } from '../../../src/@orm/user-project';

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
    email: 'exist-not-finished@mail.com',
    roles: [{ name: ROLES.USER }],
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
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'super-admin@mail.com' },
    member: { email: 'exist-not-finished@mail.com' },
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
    title: 'Other Task',
  },
]);

export const userWorksFixture = createUserWorks([
  {
    finishAt: null,
    startAt: moment().subtract(1, 'seconds'),
    task: { title: 'NotFinished' },
    user: { email: 'exist-not-finished@mail.com' },
  },
  {
    description: 'super-admin@mail.com userWork',
    finishAt: null,
    task: { title: 'NotFinished' },
    user: { email: 'super-admin@mail.com' },
  },
  {
    description: 'super-admin@mail.com userWork2',
    finishAt: moment().subtract(1, 'minutes'),
    task: { title: 'NotFinished' },
    user: { email: 'super-admin@mail.com' },
  },

  {
    description: 'exist-not-finished@mail.com userWork3',
    finishAt: moment().subtract(1, 'minutes'),
    startAt: moment().subtract(40, 'minutes'),
    task: { title: 'Other Task' },
    user: { email: 'exist-not-finished@mail.com' },
  },
  {
    description: 'exist-not-finished@mail.com removed',
    finishAt: moment().subtract(10, 'minutes'),
    startAt: moment().subtract(30, 'minutes'),
    task: { title: 'Other Task' },
    user: { email: 'exist-not-finished@mail.com' },
  },
  {
    description: 'exist-not-finished@mail.com touched',
    finishAt: moment().subtract(30, 'minutes'),
    startAt: moment().subtract(59, 'minutes'),
    task: { title: 'Other Task' },
    user: { email: 'exist-not-finished@mail.com' },
  },
]);
