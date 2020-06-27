export enum ROLE {
  ARCHITECT = 'architect',
  DEVELOPER = 'dev-full',
  TESTER = 'qa-engineer',
  DESIGNER = 'designer',
}

export interface IRole {
  id: ROLE;
  title: string;
  order: number;
}
