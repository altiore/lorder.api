import { ROLE } from './role';
import { STATUS_NAME } from './status';

export enum MOVE_TYPE {
  PUSH_FORWARD = 'push_forward',
  BRING_BACK = 'bring_back',
  JUMP = 'JUMP',
}

export interface IMove {
  type: MOVE_TYPE;
  to: STATUS_NAME;
  role?: ROLE;
  requirements?: { fields?: any };
}
