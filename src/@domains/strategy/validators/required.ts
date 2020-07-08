import { IValidator } from '..';

export const required: IValidator = (field: string, value: any) => {
  if (typeof value !== 'undefined' && typeof value !== null && value !== '') {
    return undefined;
  }

  return { required: `Поле ${field} обязательно!` };
};
