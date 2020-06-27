export enum TASK_TYPE {
  FEAT = 'feature',
  BUG = 'bug',
  DOC = 'documentation',
  ORG = 'organize',
}

export interface ITaskType {
  name: TASK_TYPE;
}
