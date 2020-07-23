import { COMPLEXITY, URGENCY } from '../../../../@orm/user-task';
import { COLUMN_TYPE, IStep, MOVE_TYPE, ROLE, STATUS_NAME } from '../../types';
import { isString, oneOf, required } from '../../validators';
import { longerThen } from '../../validators/longerThan';

export const feature_strategy: Array<IStep> = [
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.PREPARING,
    },
    status: STATUS_NAME.CREATING,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        to: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
        role: ROLE.ARCHITECT,
        requirements: {
          fields: {
            description: [required, longerThen(120)],
          },
          transit: true,
        },
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.PREPARING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.BACK_LOG,
    },
    status: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.ASSIGNING_RESPONSIBLE,
        requirements: {
          fields: {
            urgency: [required, isString, oneOf(URGENCY)],
          },
          transit: true,
        },
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.PREPARING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.BACK_LOG,
    },
    status: STATUS_NAME.ASSIGNING_RESPONSIBLE,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.ESTIMATION_BEFORE_PERFORMER,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.PREPARING,
    },
    status: STATUS_NAME.ESTIMATION_BEFORE_PERFORMER,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ASSIGNING_PERFORMER,
        requirements: {
          fields: {
            complexity: [required, oneOf(COMPLEXITY)],
          },
          transit: true,
        },
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.PREPARING,
    },
    status: STATUS_NAME.ASSIGNING_PERFORMER,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ESTIMATION_BEFORE_TO_DO,
        requirements: {
          transit: true,
        },
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
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
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.READY_TO_DO,
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.ESTIMATION_BEFORE_ASSIGNING,
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
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.PROF_REVIEW,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.DEVELOPING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.CODE_REVIEW,
      [ROLE.TESTER]: COLUMN_TYPE.DEVELOPING,
    },
    status: STATUS_NAME.PROF_REVIEW,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.TESTING,
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.READY_TO_DO,
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
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.TESTER,
        to: STATUS_NAME.ARCHITECT_REVIEW,
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.TESTER,
        to: STATUS_NAME.ESTIMATION_BEFORE_TO_DO,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.PUBLISHING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.CHECKING,
      [ROLE.TESTER]: COLUMN_TYPE.REVIEWING,
    },
    status: STATUS_NAME.ARCHITECT_REVIEW,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.READY_TO_DEPLOY,
      },
      {
        type: MOVE_TYPE.BRING_BACK,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.TESTING,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.PUBLISHING,
      [ROLE.DEVELOPER]: COLUMN_TYPE.CHECKING,
      [ROLE.TESTER]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.READY_TO_DEPLOY,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.DEPLOYED_PROF_ESTIMATION,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.POST_ESTIMATION,
      [ROLE.DEVELOPER]: COLUMN_TYPE.POST_ESTIMATION,
      [ROLE.TESTER]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.DEPLOYED_PROF_ESTIMATION,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.DEVELOPER,
        to: STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.POST_ESTIMATION,
      [ROLE.DEVELOPER]: COLUMN_TYPE.POST_ESTIMATION,
      [ROLE.TESTER]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.DEPLOYED_ARCHITECT_ESTIMATION,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.POST_ESTIMATION,
      [ROLE.DEVELOPER]: COLUMN_TYPE.POST_ESTIMATION,
    },
    status: STATUS_NAME.DEPLOYED_COMMUNITY_ESTIMATION,
    moves: [
      {
        type: MOVE_TYPE.PUSH_FORWARD,
        role: ROLE.ARCHITECT,
        to: STATUS_NAME.DONE,
      },
    ],
  },
  {
    column: {
      [ROLE.ARCHITECT]: COLUMN_TYPE.FINISHING,
    },
    status: STATUS_NAME.DONE,
    moves: [],
  },
];
