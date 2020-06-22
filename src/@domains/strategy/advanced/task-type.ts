export enum TASK_TYPE {
  FEAT = 'feature',
  BUG = 'bug',
  DOC = 'documentation',
  ORG = 'organize',
}

export interface ITaskType {
  name: TASK_TYPE;
}

export const item: Array<ITaskType> = [
  { name: TASK_TYPE.FEAT },
  { name: TASK_TYPE.BUG },
  { name: TASK_TYPE.DOC },
  { name: TASK_TYPE.ORG },
];
