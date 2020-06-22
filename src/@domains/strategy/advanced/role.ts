export enum ROLE {
  ARCHITECT = 'architect',
  DEVELOPER = 'developer',
  TESTER = 'tester',
  DESIGNER = 'designer',
}

export interface IRole {
  name: ROLE;
  title: string;
  order: number;
}

export const items: Array<IRole> = [
  { name: ROLE.ARCHITECT, title: 'Архитектор', order: 1 },
  { name: ROLE.DESIGNER, title: 'Дизайнер', order: 2 },
  { name: ROLE.DEVELOPER, title: 'Разработчик', order: 3 },
  { name: ROLE.TESTER, title: 'Тестировщик', order: 4 },
];
