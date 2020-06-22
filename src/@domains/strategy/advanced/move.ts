import { STATUS_NAME } from './status';

export enum MOVE_TYPE {
  PUSH_FORWARD = 'push_forward',
  BRING_BACK = 'bring_back',
}

export enum COLUMN_TYPE {
  DEVELOPMENT = 'development',
  TO_DO = 'to_do',
  ESTIMATION = 'estimation',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  REVIEW = 'review',
  TESTING = 'testing',
  DEPLOYING = 'deploying',
}

export interface IDestination {
  type: MOVE_TYPE;
  status: STATUS_NAME;
  requirements?: string[];
}

export interface IMove {
  column: [COLUMN_TYPE, number];
  from: STATUS_NAME | STATUS_NAME[];
  to?: IDestination[];
}
