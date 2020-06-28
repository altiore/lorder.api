import { STATUS_NAME } from '../../../@domains/strategy';
import { ROLES } from '../../../@orm/role';
import { ACCESS_LEVEL } from '../../../@orm/user-project';
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
    statusTypeName: STATUS_NAME.READY_TO_DO,
    title: 'IN_TESTING',
  },
]);

export const userWorksFixture = createUserWorks([
  {
    finishAt: null,
    task: { title: 'NotFinished' },
    user: { email: 'exist-not-finished@mail.com' },
  },
]);
