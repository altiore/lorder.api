import { IValidator } from '..';

export const moreThan = (minValue: number, strict: boolean = true): IValidator => (field: string, value: number) => {
  if (strict) {
    if (value > minValue) {
      return undefined;
    }
  } else {
    if (value >= minValue) {
      return undefined;
    }
  }

  return { moreThan: `${field} должно быть больше ${minValue}` };
};
