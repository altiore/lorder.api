import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { ExtractJwt } from 'passport-jwt';

import { Request, Response } from 'express';

import { User } from '../../@orm/user';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      throw new UnauthorizedException();
    }
    const userInfo = jwt.decode(token) as JwtPayload;
    req.user = await this.validate(userInfo);

    return true;
  }

  async validate(payload: JwtPayload) {
    let user;
    if (payload.uid) {
      user = await this.authService.validateUser(payload);
    }

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  getRequest(context: ExecutionContext): Request & { user: User } {
    return context.switchToHttp().getRequest<Request & { user: User }>();
  }

  getResponse(context: ExecutionContext): Response {
    return context.switchToHttp().getResponse<Response>();
  }
}
