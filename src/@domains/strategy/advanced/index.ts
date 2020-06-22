import { IMove } from './move';
import { architect_feat } from './moves/architect_feat';
import { developer_feat } from './moves/developer_feat';
import { ROLE } from './role';
import { TASK_TYPE } from './task-type';

export type IAllMoves = { [roleKey in ROLE]: { [taskTypeKey in TASK_TYPE]: IMove[] } };

const allMoves: IAllMoves = {
  [ROLE.ARCHITECT]: {
    [TASK_TYPE.FEAT]: architect_feat,
    [TASK_TYPE.BUG]: [],
    [TASK_TYPE.ORG]: [],
    [TASK_TYPE.DOC]: [],
  },
  [ROLE.DEVELOPER]: {
    [TASK_TYPE.FEAT]: developer_feat,
    [TASK_TYPE.BUG]: [],
    [TASK_TYPE.ORG]: [],
    [TASK_TYPE.DOC]: [],
  },
  [ROLE.DESIGNER]: {
    [TASK_TYPE.FEAT]: [],
    [TASK_TYPE.BUG]: [],
    [TASK_TYPE.ORG]: [],
    [TASK_TYPE.DOC]: [],
  },
  [ROLE.ARCHITECT]: {
    [TASK_TYPE.FEAT]: [],
    [TASK_TYPE.BUG]: [],
    [TASK_TYPE.ORG]: [],
    [TASK_TYPE.DOC]: [],
  },
  [ROLE.TESTER]: {
    [TASK_TYPE.FEAT]: [],
    [TASK_TYPE.BUG]: [],
    [TASK_TYPE.ORG]: [],
    [TASK_TYPE.DOC]: [],
  },
};

export default allMoves;
