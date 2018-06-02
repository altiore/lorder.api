import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(errors: any[] = [], message?: string) {
    super(
      {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: message || 'Validation Error',
        errors,
      },
      HttpStatus.UNPROCESSABLE_ENTITY,
    );
  }
}
