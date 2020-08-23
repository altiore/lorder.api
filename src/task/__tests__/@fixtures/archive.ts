import { ROLES } from '../../../@orm/entities/role.entity';
import { ACCESS_LEVEL } from '../../../@orm/entities/user-project.entity';
import { createProjects, createTasks, createUserProjects, createUsers } from '../../../@test-helper/@fixtureCreators';

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
    userTasks: [{ user: { email: 'task-owner@mail.com' } }],
  },
  {
    isArchived: true,
    project: { owner: { email: 'task-owner@mail.com' } },
    title: 'already-archived',
    userTasks: [{ user: { email: 'task-owner@mail.com' } }],
  },
]);
