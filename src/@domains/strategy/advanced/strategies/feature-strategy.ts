import { MOVE_TYPE, ROLE, STATUS_NAME } from '../../';
import { COLUMN_TYPE } from '../../types/column-type';
import { IStep } from '../../types/step';

export const feature_strategy: Array<IStep> = [
  {
    status: STATUS_NAME.CREATING,
    roles: [ROLE.ARCHITECT],
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.PREPARING,
    },
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        to: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
        role: ROLE.ARCHITECT,
        requirements: {
          fields: ['performerId'],
        },
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.TO_DO,
      [ROLE.DEVELOPER]: COLUMN_TYPE.BACK_LOG,
    },
    status: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.ESTIMATION_BEFORE_PERFORMER,
        requirements: {
          fields: ['value'],
        },
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.TO_DO,
      [ROLE.DEVELOPER]: COLUMN_TYPE.BACK_LOG,
    },
    status: STATUS_NAME.ASSIGNING_RESPONSIBLE,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.ESTIMATION_BEFORE_PERFORMER,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.PREPARING,
    },
    status: STATUS_NAME.ESTIMATION_BEFORE_PERFORMER,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ASSIGNING_PERFORMER,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.PREPARING,
    },
    status: STATUS_NAME.ASSIGNING_PERFORMER,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ESTIMATION_BEFORE_TO_DO,
        requirements: {
          fields: ['value'],
        },
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.PREPARING,
      [ROLE.TESTER]: COLUMN_TYPE.DEVELOPING,
    },
    status: STATUS_NAME.ESTIMATION_BEFORE_TO_DO,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.READY_TO_DO,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.TO_DO,
      [ROLE.TESTER]: COLUMN_TYPE.DEVELOPING,
    },
    status: STATUS_NAME.READY_TO_DO,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.PROF_REVIEW,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.REVIEWING,
      [ROLE.TESTER]: COLUMN_TYPE.DEVELOPING,
    },
    status: STATUS_NAME.PROF_REVIEW,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.TESTING,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.CHECKING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.CHECKING,
      [ROLE.TESTER]: COLUMN_TYPE.TO_DO,
    },
    status: STATUS_NAME.TESTING,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.TESTER,
        to: STATUS_NAME.ARCHITECT_REVIEW,
        requirements: {},
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.TESTER,
        to: STATUS_NAME.ESTIMATION_BEFORE_TO_DO,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.REVIEWING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.CHECKING,
      [ROLE.TESTER]: COLUMN_TYPE.REVIEWING,
    },
    status: STATUS_NAME.ARCHITECT_REVIEW,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.READY_TO_DEPLOY,
        requirements: {},
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.TESTING,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.TESTER]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.READY_TO_DEPLOY,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.DEPLOYED_PROF_ESTIMATION,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.DEVELOPER]: COLUMN_TYPE.POST_ESTIMATION,
      [ROLE.TESTER]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.DEPLOYED_PROF_ESTIMATION,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION,
        requirements: {},
      },
    ],
  },
  {
    column: {
      [ROLE.DEVELOPER]: COLUMN_TYPE.FINISHING,
      [ROLE.TESTER]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION,
    roles: [ROLE.ARCHITECT, ROLE.DEVELOPER, ROLE.TESTER],
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION,
        requirements: {},
      },
    ],
  },
  {
    status: STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION,
    roles: [ROLE.ARCHITECT],
    moves: [],
  },
  {
    status: STATUS_NAME.DONE,
    roles: [ROLE.ARCHITECT],
    moves: [],
  },
];
