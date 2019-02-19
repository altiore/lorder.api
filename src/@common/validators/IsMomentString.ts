import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import moment = require('moment');

@ValidatorConstraint({ name: 'isMomentString', async: false })
export class IsMomentString implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return propertyValue === moment(propertyValue).toISOString();
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" не корректный формат времени`;
  }
}
