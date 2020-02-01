import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { intersection } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const preparedRoles = typeof roles === 'string' ? [roles] : roles;
    if (!Array.isArray(preparedRoles)) {
      return false;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user || !user.roles) {
      return false;
    }
    const isHasRole = intersection(user.roles.map(r => r.name), preparedRoles).length;
    return Boolean(isHasRole);
  }
}
