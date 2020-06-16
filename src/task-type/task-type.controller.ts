import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { ROLES } from '@orm/role';

import { Auth, res } from '@common/decorators';

import { TaskTypeCreateDto } from '../@orm/task-type/dto';
import { TaskType } from '../@orm/task-type/task-type.entity';
import { TaskTypeService } from './task-type.service';

@ApiTags('task-types (roles: user(get), super-admin(create/edit/delete))')
@Crud({
  dto: {
    create: TaskTypeCreateDto,
    update: TaskTypeCreateDto,
  },
  model: {
    type: TaskType,
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(TaskType).getMany, ROLES.USER)],
    },
    createOneBase: {
      decorators: [Auth(res(TaskType).createOne, ROLES.SUPER_ADMIN)],
    },
    deleteOneBase: {
      decorators: [Auth(res(TaskType).deleteOne, ROLES.SUPER_ADMIN)],
    },
    updateOneBase: {
      decorators: [Auth(res(TaskType).updateOne, ROLES.SUPER_ADMIN)],
    },
  },
})
@Controller('task-types')
export class TaskTypeController {
  // tslint:disable-next-line
  constructor(private readonly service: TaskTypeService) {}
}
