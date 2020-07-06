import { IColumn, IStep, MOVE_TYPE, ROLE, STATUS_NAME } from '../';

const roleTypes = Object.values(ROLE);

// const roles: Array<IRole> = roleTypes.map((role, index) => ({
//   id: role,
//   title: role,
//   order: index + 1,
// }));

export const steps: Array<IStep> = [
  {
    status: STATUS_NAME.CREATING,
    roles: roleTypes,
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
    status: STATUS_NAME.READY_TO_DO,
    roles: roleTypes,
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
    status: STATUS_NAME.TESTING,
    roles: roleTypes,
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
    status: STATUS_NAME.DONE,
    roles: roleTypes,
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
  moves,
}));
