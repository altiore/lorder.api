import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiResponseOptions, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ROLES } from '@orm/role';
import { ACCESS_LEVEL } from '@orm/user-project';

import { AccessLevelGuard } from '../../project/@common/guards';
import { RolesGuard } from '../guards';

export const res = (entity: any, description?: string) => ({
  c: {
    description: description || `Изменение`,
    status: 200,
    type: entity,
  } as ApiResponseOptions,
  createOne: {
    description: description || `Create one ${entity.name}`,
    status: 201,
    type: entity,
  } as ApiResponseOptions,
  deleteOne: {
    description: description || `Delete one ${entity.name}`,
    status: 200,
    type: entity,
  } as ApiResponseOptions,
  getMany: {
    description: description || `Retrieve many ${entity.name}-s`,
    isArray: true,
    status: 200,
    type: entity,
  } as ApiResponseOptions,
  getOne: {
    description: description || `Retrieve one ${entity.name}`,
    isArray: true,
    status: 200,
    type: entity,
  } as ApiResponseOptions,
  updateOne: {
    description: description || `Update one ${entity.name}`,
    status: 200,
    type: entity,
  } as ApiResponseOptions,
});

export function Auth(apiResponseOpts: ApiResponseOptions, roles: ROLES[] | ROLES, accessLevel?: ACCESS_LEVEL) {
  if (accessLevel) {
    return applyDecorators(
      ApiResponse(apiResponseOpts),
      SetMetadata('roles', roles),
      SetMetadata('accessLevel', accessLevel),
      UseGuards(AuthGuard('jwt'), RolesGuard, AccessLevelGuard),
      ApiBearerAuth(),
      ApiUnauthorizedResponse({ description: 'Unauthorized"' })
    );
  }
  return applyDecorators(
    ApiResponse(apiResponseOpts),
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' })
  );
}
