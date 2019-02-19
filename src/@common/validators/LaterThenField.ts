import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import moment = require('moment');

@ValidatorConstraint({ name: 'laterThenField', async: false })
export class LaterThenField implements ValidatorConstraintInterface {
  validate(propertyValue: string, args: ValidationArguments) {
    return !propertyValue || moment(propertyValue).diff(moment(args.object[args.constraints[0]])) > 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `"${args.property}" не может произойти раньше чем "${args.constraints[0]}"`;
  }
}
