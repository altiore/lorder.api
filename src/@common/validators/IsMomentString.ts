import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import moment = require('moment');

@ValidatorConstraint({ name: 'isMomentString', async: false })
export class IsMomentString implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    const isValid = propertyValue === moment(propertyValue).toISOString();
    return isValid;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" не корректный формат времени`;
  }
}
