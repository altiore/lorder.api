import { IValidator } from '..';

export const oneOf = (enumValue: object): IValidator => (field: string, value: number) => {
  if (enumValue[value]) {
    return undefined;
  }

  return { oneOf: `${field} недопустимое значение = ${value}` };
};
