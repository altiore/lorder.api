import { keyBy, mapValues } from 'lodash';

import { IColumn, IMove, IShortMove, IStep, MOVE_TYPE, ROLE, STATUS_NAME } from '../types';

// const roleTypes = Object.values(ROLE);

// const roles: Array<IRole> = roleTypes.map((role, index) => ({
//   id: role,
//   title: role,
//   order: index + 1,
// }));

export const stepColumn = (columnName: STATUS_NAME) => mapValues(keyBy(Object.values(ROLE)), () => columnName);

export const steps: Array<IStep> = [
  {
    column: stepColumn(STATUS_NAME.CREATING),
    status: STATUS_NAME.CREATING,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        to: STATUS_NAME.READY_TO_DO,
      },
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.TESTING,
      },
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.DONE,
      },
    ],
  },
  {
    column: stepColumn(STATUS_NAME.READY_TO_DO),
    status: STATUS_NAME.READY_TO_DO,
    moves: [
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.CREATING,
      },
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        to: STATUS_NAME.TESTING,
      },
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.DONE,
      },
    ],
  },
  {
    column: stepColumn(STATUS_NAME.TESTING),
    status: STATUS_NAME.TESTING,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        to: STATUS_NAME.READY_TO_DO,
      },
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.CREATING,
      },
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.DONE,
      },
    ],
  },
  {
    column: stepColumn(STATUS_NAME.DONE),
    status: STATUS_NAME.DONE,
    moves: [
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.READY_TO_DO,
      },
      {
        type: MOVE_TYPE.JUMP,
        to: STATUS_NAME.TESTING,
      },
    ],
  },
];

export const columns: Array<IColumn> = steps.map(({ status, moves }) => ({
  column: status,
  statuses: [status],
  moves: moves.map(
    (m: IMove): IShortMove => ({
      from: status,
      type: m.type,
      to: m.to,
    })
  ),
}));
