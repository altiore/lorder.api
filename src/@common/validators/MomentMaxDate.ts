import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import moment = require('moment');

@ValidatorConstraint({ name: 'momentMaxDate', async: false })
export class MomentMaxDate implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return !propertyValue || moment().diff(moment(propertyValue)) > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" не может быть будущим моментом`;
  }
}
