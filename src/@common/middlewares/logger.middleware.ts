import { Injectable, NestMiddleware, MiddlewareFunction, Request } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  resolve(...args: any[]): MiddlewareFunction {
    return (req: Request, res, next) => {
      console.log('Request...', req.method, args[0]);
      next();
    };
  }
}
