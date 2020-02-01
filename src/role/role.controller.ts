import { Auth, res } from '@common/decorators';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Role, ROLES } from '@orm/role';

import { RoleService } from './role.service';

@ApiTags('roles (roles: USER)')
@Crud({
  model: {
    type: Role,
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(Role).getMany, ROLES.USER)],
    },
    createOneBase: {
      decorators: [Auth(res(Role).createOne, ROLES.SUPER_ADMIN)],
    },
    deleteOneBase: {
      decorators: [Auth(res(Role).deleteOne, ROLES.SUPER_ADMIN)],
    },
  },
})
@Controller('roles')
export class RoleController {
  // tslint:disable-next-line
  constructor(private readonly service: RoleService) {}
}
