import { IColumn, IMove, IStep, MOVE_TYPE, ROLE, STATUS_NAME } from '../';

const roleTypes = Object.values(ROLE);

// const roles: Array<IRole> = roleTypes.map((role, index) => ({
//   id: role,
//   title: role,
//   order: index + 1,
// }));

const moves: Array<IMove> = [
  {
    type: MOVE_TYPE.ANY,
    to: STATUS_NAME.CREATING,
  },
  {
    type: MOVE_TYPE.ANY,
    to: STATUS_NAME.READY_TO_DO,
  },
  {
    type: MOVE_TYPE.ANY,
    to: STATUS_NAME.TESTING,
  },
  {
    type: MOVE_TYPE.ANY,
    to: STATUS_NAME.DONE,
  },
];

export const steps: Array<IStep> = [
  {
    status: STATUS_NAME.CREATING,
    roles: roleTypes,
    moves: moves.filter((el) => el.to !== STATUS_NAME.CREATING),
  },
  {
    status: STATUS_NAME.READY_TO_DO,
    roles: roleTypes,
    moves: moves.filter((el) => el.to !== STATUS_NAME.READY_TO_DO),
  },
  {
    status: STATUS_NAME.TESTING,
    roles: roleTypes,
    moves: moves.filter((el) => el.to !== STATUS_NAME.TESTING),
  },
  {
    status: STATUS_NAME.DONE,
    roles: roleTypes,
    moves: moves.filter((el) => el.to !== STATUS_NAME.DONE),
  },
];

export const columns: Array<IColumn> = [
  {
    column: STATUS_NAME.CREATING,
    statuses: [STATUS_NAME.CREATING],
    moves: [{ type: MOVE_TYPE.ANY }],
  },
  {
    column: STATUS_NAME.READY_TO_DO,
    statuses: [STATUS_NAME.READY_TO_DO],
    moves: [{ type: MOVE_TYPE.ANY }],
  },
  {
    column: STATUS_NAME.TESTING,
    statuses: [STATUS_NAME.TESTING],
    moves: [{ type: MOVE_TYPE.ANY }],
  },
  {
    column: STATUS_NAME.DONE,
    statuses: [STATUS_NAME.DONE],
    moves: [{ type: MOVE_TYPE.ANY }],
  },
];
