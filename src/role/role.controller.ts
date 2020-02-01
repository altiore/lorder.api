import { Auth, res } from '@common/decorators';
import { Body, Controller, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';
import { DeleteResult } from 'typeorm';

import { Role, ROLES } from '@orm/role';

import { BulkDeleteRoleDto } from './dto';
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
  constructor(private readonly service: RoleService) {}

  @Auth(res(Role).deleteOne, ROLES.SUPER_ADMIN)
  @Delete('bulk')
  public async deleteMany(@Body() data: BulkDeleteRoleDto): Promise<DeleteResult> {
    return this.service.deleteMany(data.ids);
  }
}
