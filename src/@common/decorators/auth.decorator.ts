import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiResponseOptions, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { get } from 'lodash';

import { ROLES } from '@orm/role';
import { ACCESS_LEVEL } from '@orm/user-project';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { AccessLevelGuard } from '../../project/@common/guards';
import { RolesGuard } from '../guards';

export const res = (entity: any, description?: string) => {
  const entityName = get(entity, 'name', 'UNDEFINED');
  return {
    c: {
      description: description || `Изменение`,
      status: 200,
      type: entity,
    } as ApiResponseOptions,
    createOne: {
      description: description || `Create one ${entityName}`,
      status: 201,
      type: entity,
    } as ApiResponseOptions,
    deleteOne: {
      description: description || `Delete one ${entityName}`,
      status: 200,
      type: entity,
    } as ApiResponseOptions,
    getMany: {
      description: description || `Retrieve many ${entityName}-s`,
      isArray: true,
      status: 200,
      type: entity,
    } as ApiResponseOptions,
    getOne: {
      description: description || `Retrieve one ${entityName}`,
      isArray: true,
      status: 200,
      type: entity,
    } as ApiResponseOptions,
    updateOne: {
      description: description || `Update one ${entityName}`,
      status: 200,
      type: entity,
    } as ApiResponseOptions,
  };
};

export function Auth(apiResponseOpts: ApiResponseOptions, roles: ROLES[] | ROLES, accessLevel?: ACCESS_LEVEL) {
  if (accessLevel) {
    return applyDecorators(
      ApiResponse(apiResponseOpts),
      SetMetadata('roles', roles),
      SetMetadata('accessLevel', accessLevel),
      UseGuards(JwtAuthGuard, RolesGuard, AccessLevelGuard),
      ApiBearerAuth(),
      ApiUnauthorizedResponse({ description: 'Unauthorized"' })
    );
  }
  return applyDecorators(
    ApiResponse(apiResponseOpts),
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' })
  );
}
