import { COLUMN_TYPE } from './column-type';
import { IMove } from './move';
import { ROLE } from './role';
import { STATUS_NAME } from './status';

export interface IStep {
  column?: { [key in ROLE]?: COLUMN_TYPE };
  status: STATUS_NAME;
  roles: ROLE[];
  moves: IMove[];
}
