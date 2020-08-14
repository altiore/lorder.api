import { Body, Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { DeleteResult } from 'typeorm';

import { ROLES } from '@orm/role';
import { RoleFlow } from '@orm/role-flow';

import { Auth, res } from '@common/decorators';

import { BulkDeleteRoleDto } from './dto';
import { RoleService } from './role.service';

@ApiTags('roles (roles: USER)')
@Crud({
  model: {
    type: RoleFlow,
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(RoleFlow).getMany, ROLES.USER)],
    },
    createOneBase: {
      decorators: [Auth(res(RoleFlow).createOne, ROLES.SUPER_ADMIN)],
    },
    deleteOneBase: {
      decorators: [Auth(res(RoleFlow).deleteOne, ROLES.SUPER_ADMIN)],
    },
  },
  params: {
    id: {
      field: 'id',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@Controller('roles')
export class RoleController {
  constructor(private readonly service: RoleService) {}

  @Auth(res(RoleFlow).deleteOne, ROLES.SUPER_ADMIN)
  @Delete('bulk')
  public async deleteMany(@Body() data: BulkDeleteRoleDto): Promise<DeleteResult> {
    return this.service.deleteMany(data.ids);
  }
}
