import { ROLES } from '../../../../@orm/role';
import { ACCESS_LEVEL } from '../../../../@orm/user-project';
import {
  createProjectRoles,
  createProjects,
  createRoleFlows,
  createUserProjects,
  createUsers,
} from '../../../../@test-helper/@fixtureCreators';

export const usersFixture = createUsers([
  {
    email: 'project-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'not-owner@mail.com',
    roles: [{ name: ROLES.USER }],
  },
  {
    email: 'member@mail.com',
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
    accessLevel: ACCESS_LEVEL.INDIGO,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'not-owner@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
  {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: { email: 'project-owner@mail.com' },
    member: { email: 'member@mail.com' },
    project: { owner: { email: 'project-owner@mail.com' } },
  },
]);

export const roleFlows = createRoleFlows([
  {
    id: 'architect',
    name: 'Архитектор',
  },
  {
    id: 'dev-full',
    name: 'Фулл Стек Разработчик',
  },
  {
    id: 'not-in-project',
    name: 'Роли нет в проекте',
  },
]);

export const projectRoles = createProjectRoles([
  {
    role: { id: 'architect' },
    project: { title: 'Test1' },
  },
  {
    role: { id: 'dev-full' },
    project: { title: 'Test1' },
  },
]);
