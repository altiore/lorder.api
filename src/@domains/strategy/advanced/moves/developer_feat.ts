import { COLUMN_TYPE, IMove, MOVE_TYPE } from '../move';
import { STATUS_NAME } from '../status';

export const developer_feat: Array<IMove> = [
  {
    column: [COLUMN_TYPE.ESTIMATION, 1],
    from: STATUS_NAME.ESTIMATION_BEFORE_TO_DO,
    to: [
      { type: MOVE_TYPE.PUSH_FORWARD, status: STATUS_NAME.READY_TO_DO },
      { type: MOVE_TYPE.BRING_BACK, status: STATUS_NAME.CREATING, requirements: ['comment'] },
    ],
  },
  {
    column: [COLUMN_TYPE.TO_DO, 2],
    from: STATUS_NAME.READY_TO_DO,
    to: [
      { type: MOVE_TYPE.PUSH_FORWARD, status: STATUS_NAME.IN_PROGRESS },
      { type: MOVE_TYPE.BRING_BACK, status: STATUS_NAME.ESTIMATION_BEFORE_TO_DO, requirements: ['comment'] },
    ],
  },
  {
    column: [COLUMN_TYPE.IN_PROGRESS, 3],
    from: STATUS_NAME.IN_PROGRESS,
    to: [
      { type: MOVE_TYPE.PUSH_FORWARD, status: STATUS_NAME.PROF_REVIEW },
      { type: MOVE_TYPE.BRING_BACK, status: STATUS_NAME.READY_TO_DO },
    ],
  },
  {
    column: [COLUMN_TYPE.REVIEW, 4],
    from: STATUS_NAME.PROF_REVIEW,
    to: [
      { type: MOVE_TYPE.PUSH_FORWARD, status: STATUS_NAME.ESTIMATION_BEFORE_TEST },
      { type: MOVE_TYPE.BRING_BACK, status: STATUS_NAME.READY_TO_DO },
    ],
  },
  {
    column: [COLUMN_TYPE.TESTING, 5],
    from: [
      STATUS_NAME.ESTIMATION_BEFORE_TEST,
      STATUS_NAME.READY_TO_TEST,
      STATUS_NAME.TESTING,
      STATUS_NAME.ARCHITECT_REVIEW,
    ],
  },
  {
    column: [COLUMN_TYPE.DEPLOYING, 6],
    from: [STATUS_NAME.READY_TO_DEPLOY, STATUS_NAME.DEPLOYING, STATUS_NAME.DEPLOYED_PROF_ESTIMATION],
    to: [{ type: MOVE_TYPE.PUSH_FORWARD, status: STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION }],
  },
  {
    column: [COLUMN_TYPE.DONE, 7],
    from: [
      STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION,
      STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION,
      STATUS_NAME.DEPLOYED_ESTIMATION,
      STATUS_NAME.DONE,
    ],
  },
];
