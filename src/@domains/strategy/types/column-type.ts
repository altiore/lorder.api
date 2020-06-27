import { IMove } from './move';
import { STATUS_NAME } from './status';

export enum COLUMN_TYPE {
  BACK_LOG = 'back-log',
  PREPARING = 'preparing',
  DEVELOPING = 'developing',
  TO_DO = 'to-do',
  REVIEWING = 'reviewing',
  TESTING = 'testing',
  DONE = 'done',

  POST_ESTIMATION = 'post-estimation',
}

export interface IColumn {
  column: STATUS_NAME | COLUMN_TYPE;
  statuses: STATUS_NAME[];
  moves: IMove[];
}
