import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { parseDetail } from '../helpers/parseDetailFromTypeormException';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    if (exception.getResponse && exception.getStatus) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else if (exception.message && exception.name) {
      switch (exception.name) {
        case 'EntityNotFound': {
          const status = HttpStatus.NOT_FOUND;
          response.status(status).json({
            statusCode: status,
            message: process.env.NODE_ENV === 'development' ? exception.message : 'Requested Entity not found',
          });
          break;
        }
        case 'QueryFailedError': {
          let parsedDetail;
          if (exception.detail) {
            const status = HttpStatus.UNPROCESSABLE_ENTITY;
            parsedDetail = parseDetail(exception.detail);
            response.status(status).json({
              statusCode: status,
              message: parsedDetail[3] === 'already exists' ? 'Validation Error' : exception.detail,
              errors: [
                {
                  value: parsedDetail[2],
                  property: parsedDetail[1],
                  children: [],
                  constraints: {
                    isUnique: parsedDetail[3],
                  },
                },
              ],
            });
          } else {
            response.status(status).json({
              statusCode: status,
              message: (exception && exception.message) || exception.toString ? exception.toString() : 'NO',
            });
          }

          break;
        }
        default: {
          const status = HttpStatus.NOT_ACCEPTABLE;
          response.status(status).json({
            statusCode: status,
            message: exception.message,
          });
          break;
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        console.error(exception);
      }
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
      });
    }
  }
}
