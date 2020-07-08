import { IValidator } from '..';

export const isString: IValidator = (field: string, value: number) => {
  if (typeof value === 'string') {
    return undefined;
  }

  return { isString: `Поле ${field} должно быть строкой` };
};
