import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { Project } from '@orm/project';
import { User } from '@orm/user';

import { ValidationException } from '../exceptions/validation.exception';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value, { data, metatype, type }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      validationError: { target: false },
      whitelist: true,
    });
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object, User, Project];
    return !types.find((type) => metatype === type);
  }
}
