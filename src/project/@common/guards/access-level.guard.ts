import { CanActivate, ExecutionContext, Injectable, NotAcceptableException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { get } from 'lodash';

import { ProjectService } from '../../project.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessLevel = this.reflector.get<string[]>('accessLevel', context.getHandler());
    if (!accessLevel) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = parseInt(get(request, 'params.projectId', 0), 0);
    if (!projectId) {
      throw new NotAcceptableException(
        `Нельзя использовать ${AccessLevelGuard.name} без 'projectId' параметра.
         Параметр должен быть получен из url и должен фактически являться Project.id
         Пожалуйста, добавьте @Post(':projectId') или что-то подобное`
      );
    }
    if (user && user.isSuperAdmin) {
      request.project = await this.projectService.findOne(projectId);
      return true;
    }
    try {
      request.project = await this.projectService.findOneByMember(projectId, user);
    } catch (e) {
      return false;
    }
    return user && request.project && request.project.accessLevel.accessLevel >= accessLevel;
  }
}
