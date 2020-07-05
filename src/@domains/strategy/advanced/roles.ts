import { STATUS_NAME } from '..';
import { IRole, ROLE } from '../types/role';

export const roles: Array<IRole> = [
  { id: ROLE.ARCHITECT, title: 'Архитектор', order: 1, createdStatus: STATUS_NAME.CREATING },
  // { id: ROLE.DESIGNER,  title: 'Дизайнер',    order: 2, createdStatus: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING },
  { id: ROLE.DEVELOPER, title: 'Разработчик', order: 3, createdStatus: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING },
  { id: ROLE.TESTER, title: 'Тестировщик', order: 4, createdStatus: STATUS_NAME.ESTIMATION_BEFORE_TO_DO },
];
