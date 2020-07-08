import { IValidator } from '..';

export const longerThen = (minValue: number, strict: boolean = true): IValidator => (field: string, value: string) => {
  if (strict) {
    if (value && value.length && value.length > minValue) {
      return undefined;
    }
  } else {
    if (value && value.length && value.length >= minValue) {
      return undefined;
    }
  }

  return { longerThen: `${field} должно быть длиннее чем ${minValue} символов` };
};
