import { IValidator } from '..';

export const isNumber: IValidator = (field: string, value: number) => {
  if (typeof value === 'number') {
    return undefined;
  }

  return { isNumber: `Поле ${field} должно быть числом` };
};
