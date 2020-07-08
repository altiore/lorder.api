import { ROLE } from './role';
import { STATUS_NAME } from './status';

export enum MOVE_TYPE {
  PUSH_FORWARD = 'push_forward',
  BRING_BACK = 'bring_back',
  JUMP = 'JUMP',
}

export type IValidator = (field: string, value: any) => undefined | { [key in string]: string };

export interface IMove {
  type: MOVE_TYPE;
  to: STATUS_NAME;
  role?: ROLE;
  requirements?: { fields?: { [key in string]: IValidator[] }; transit?: true };
}

export interface IMoveError {
  constraints: { [key in string]: string };
  property: string;
  value: any;
}
