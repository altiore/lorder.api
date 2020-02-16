import { createProjects, createTasks, createUserProjects, createUsers } from '../../../@test-helper/@fixtureCreators';

import { ROLES } from '../../../@orm/role';
import { ACCESS_LEVEL } from '../../../@orm/user-project';

export const usersFixture = createUsers([
  {
    email: 'task-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'non-task-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
]);

export const projectsFixture = createProjects([
  {
    owner: { email: 'task-owner@mail.com' },
  },
]);

export const userProjectsFixture = createUserProjects([
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'task-owner@mail.com' },
    member: { email: 'task-owner@mail.com' },
    project: { owner: { email: 'task-owner@mail.com' } },
  },
]);

export const tasksFixture = createTasks([
  {
    project: { owner: { email: 'task-owner@mail.com' } },
    title: 'task1',
    users: [{ email: 'task-owner@mail.com' }],
  },
  {
    isArchived: true,
    project: { owner: { email: 'task-owner@mail.com' } },
    title: 'already-archived',
    users: [{ email: 'task-owner@mail.com' }],
  },
]);
