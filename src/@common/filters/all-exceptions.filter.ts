import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

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
            message: process.env.NODE_ENV === 'development' ? exception.message : 'Requested Entity not found',
            statusCode: status,
          });
          break;
        }
        case 'QueryFailedError': {
          let parsedDetail;
          if (exception.detail) {
            const status = HttpStatus.UNPROCESSABLE_ENTITY;
            parsedDetail = parseDetail(exception.detail);
            if (!parsedDetail) {
              response.status(status).json({
                message: exception.detail,
                statusCode: status,
              });
              break;
            }
            response.status(status).json({
              errors: [
                {
                  children: [],
                  constraints: {
                    isUnique: parsedDetail[3],
                  },
                  property: parsedDetail[1],
                  value: parsedDetail[2],
                },
              ],
              message: parsedDetail[3] === 'already exists' ? 'Validation Error' : exception.detail,
              statusCode: status,
            });
          } else {
            response.status(status).json({
              message: (exception && exception.message) || exception.toString ? exception.toString() : 'NO',
              statusCode: status,
            });
          }

          break;
        }
        default: {
          const status = HttpStatus.NOT_ACCEPTABLE;
          response.status(status).json({
            message: exception.message,
            statusCode: status,
          });
          break;
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') {
        /* tslint:disable */
        console.error(exception + '1');
        /* tslint:enable */
      }
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
