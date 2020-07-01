import { IMove } from './move';
import { STATUS_NAME } from './status';

export enum COLUMN_TYPE {
  BACK_LOG = 'back-log',
  PREPARING = 'preparing',
  DEVELOPING = 'developing',
  TO_DO = 'to-do',
  REVIEWING = 'reviewing',
  CHECKING = 'checking',
  FINISHING = 'finishing',

  POST_ESTIMATION = 'post-estimation',
}

/**
 * moves = true означает, что любые перемещения доступны
 * TODO: Добавить все перемещения во все стратегии
 */
export interface IColumn {
  column: STATUS_NAME | COLUMN_TYPE;
  statuses: STATUS_NAME[];
  moves: IMove[];
}
