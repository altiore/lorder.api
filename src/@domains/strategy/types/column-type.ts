import { IShortMove } from './move';
import { STATUS_NAME } from './status';

export enum COLUMN_TYPE {
  BACK_LOG = 'back-log',
  PREPARING = 'preparing',
  DEVELOPING = 'developing',
  TO_DO = 'to-do',
  REVIEWING = 'reviewing',
  CHECKING = 'checking',
  FINISHING = 'finishing',
  PUBLISHING = 'publishing',
  CODE_REVIEW = 'code-review',

  POST_ESTIMATION = 'post-estimation',
}

export interface IColumn {
  column: STATUS_NAME | COLUMN_TYPE;
  statuses: STATUS_NAME[];
  moves: IShortMove[];
}
