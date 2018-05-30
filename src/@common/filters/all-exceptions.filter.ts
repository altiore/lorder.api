import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    if (exception.getResponse && exception.getStatus) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else if (exception.message && exception.name) {
      // Catching typeorm exceptions
      const status =
        exception.name === 'EntityNotFound'
          ? HttpStatus.NOT_FOUND
          : HttpStatus.NOT_ACCEPTABLE;
      response.status(status).json({
        statusCode: status,
        message: exception.message,
      });
    } else {
      console.error(exception);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
