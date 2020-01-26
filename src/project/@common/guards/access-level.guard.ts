import { CanActivate, ExecutionContext, Injectable, NotAcceptableException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { get } from 'lodash';

import { ACCESS_LEVEL } from '../../../@orm/user-project';
import { ProjectService } from '../../project.service';

@Injectable()
export class AccessLevelGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly projectService: ProjectService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessLevel = this.reflector.get<ACCESS_LEVEL>('accessLevel', context.getHandler());
    if (typeof accessLevel !== 'number') {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const projectId = parseInt(get(request, 'params.projectId', 0), 0) || get(request, 'body.projectId');
    if (typeof projectId !== 'number') {
      throw new NotAcceptableException(
        `Нельзя использовать ${AccessLevelGuard.name} без 'projectId' параметра.
         Параметр должен быть получен из url и должен фактически являться Project.id
         Пожалуйста, добавьте @Post(':projectId') или что-то подобное`
      );
    }
    try {
      request.project = await this.projectService.findOneByMember(projectId, user);
      request.accessLevel = request.project.accessLevel;
    } catch (e) {
      if (user && user.isSuperAdmin) {
        request.project = await this.projectService.findOne(projectId);
        request.accessLevel = {
          accessLevel: -1,
          timeSum: null,
          valueSum: null,
        };
        return true;
      }
      return false;
    }
    return user && request.project && request.project.isAccess(accessLevel);
  }
}
