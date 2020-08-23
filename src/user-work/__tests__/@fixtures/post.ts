import * as moment from 'moment';

import { ROLES } from '@orm/entities/role.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';

import { STATUS_NAME } from '../../../@domains/strategy';
import {
  createProjects,
  createTasks,
  createUserProjects,
  createUsers,
  createUserTasks,
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
    statusTypeName: STATUS_NAME.READY_TO_DO,
    inProgress: true,
    value: 7,
  },
  {
    performer: { email: 'exist-not-finished@mail.com' },
    project: { owner: { email: 'super-admin@mail.com' } },
    statusTypeName: STATUS_NAME.READY_TO_DO,
    title: 'IN_TESTING',
  },
  {
    project: { owner: { email: 'super-admin@mail.com' } },
    statusTypeName: STATUS_NAME.READY_TO_DO,
    title: 'STARTED BY user@mail.com',
  },
]);

export const userWorksFixture = createUserWorks([
  {
    finishAt: null,
    startAt: moment().subtract(1, 'hour'),
    task: { title: 'NotFinished' },
    user: { email: 'exist-not-finished@mail.com' },
  },
  {
    finishAt: moment().subtract(1, 'hour'),
    startAt: moment().subtract(2, 'hour'),
    task: { title: 'NotFinished' },
    user: { email: 'exist-not-finished@mail.com' },
  },
]);

export const userTaskFixture = createUserTasks([
  {
    time: 3600000,
    benefitPart: 1,
    task: { title: 'NotFinished' },
    user: { email: 'exist-not-finished@mail.com' },
  },
]);
