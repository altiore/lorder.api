import { Injectable, NestMiddleware, Request } from '@nestjs/common';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: Request, res, next) {
    res.setHeader('Set-Cookie', 'HttpOnly;Secure;SameSite=Strict');
    next();
  }
}
