export enum ROLE {
  ARCHITECT = 'architect',
  DEVELOPER = 'dev-full',
  TESTER = 'qa-engineer',
  DESIGNER = 'designer',
  FE_DEVELOPER = 'dev-front-end',
  BE_DEVELOPER = 'dev-back-end',
  REVIEWER = 'reviewer',
}

export interface IRole {
  id: ROLE;
  title: string;
  order: number;
}
