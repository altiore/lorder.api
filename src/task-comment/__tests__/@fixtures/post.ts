import { ROLES } from '@orm/entities/role.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';

import {
  createProjects,
  createTaskComments,
  createTasks,
  createUserProjects,
  createUsers,
} from '../../../@test-helper/@fixtureCreators';

export const usersFixture = createUsers([
  {
    email: 'project-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'yellow@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'member@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'white-level@mail.com',
    roles: [{ name: ROLES.USER }],
  },
]);

export const projectsFixture = createProjects([
  {
    title: 'Test1',
    owner: { email: 'project-owner@mail.com' },
  },
]);

export const userProjectsFixture = createUserProjects([
  {
    accessLevel: ACCESS_LEVEL.VIOLET,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'project-owner@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.YELLOW,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'yellow@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'member@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.WHITE,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'white-level@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
]);

export const tasksFixture = createTasks([
  {
    project: { owner: { email: 'project-owner@mail.com' } },
    title: 'NotFinished',
  },
  {
    project: { owner: { email: 'project-owner@mail.com' } },
    title: 'Other Task',
  },
]);

export const taskCommentsFixture = createTaskComments([
  {
    task: { title: 'NotFinished' },
    user: { email: 'project-owner@mail.com' },
  },
  {
    task: { title: 'NotFinished' },
    user: { email: 'yellow@mail.com' },
  },
  {
    task: { title: 'Other Task' },
    user: { email: 'yellow@mail.com' },
  },
]);
