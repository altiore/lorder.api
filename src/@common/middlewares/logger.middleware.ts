import { Injectable, NestMiddleware, Request } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res, next) {
    /* tslint:disable */
    console.log('Request...', req.method);
    next();
  }
}
