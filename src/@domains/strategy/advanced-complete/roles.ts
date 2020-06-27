import { IRole, ROLE } from '../types/role';

export const roles: Array<IRole> = [
  { id: ROLE.ARCHITECT, title: 'Архитектор', order: 1 },
  // { id: ROLE.DESIGNER,  title: 'Дизайнер',    order: 2 },
  { id: ROLE.DEVELOPER, title: 'Разработчик', order: 3 },
  { id: ROLE.TESTER, title: 'Тестировщик', order: 4 },
];
