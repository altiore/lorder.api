import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { parseDetail } from '../helpers/parseDetailFromTypeormException';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    // const request = ctx.getRequest();

    if (exception.getResponse && exception.getStatus) {
      response.status(exception.getStatus()).send(exception.getResponse());
    } else if (exception.message && exception.name) {
      switch (exception.name) {
        case 'EntityNotFound': {
          const status = HttpStatus.NOT_FOUND;
          response.status(status).send({
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
              response.status(status).send({
                message: exception.detail,
                statusCode: status,
              });
              break;
            }
            response.status(status).send({
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
            const status = HttpStatus.INTERNAL_SERVER_ERROR;
            response.status(status).send({
              message: (exception && exception.message) || exception.toString ? exception.toString() : 'NO',
              statusCode: status,
            });
          }

          break;
        }
        default: {
          const status = HttpStatus.NOT_ACCEPTABLE;
          response.status(status).send({
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
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
