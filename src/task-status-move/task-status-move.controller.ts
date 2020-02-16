import { Auth, res } from '@common/decorators';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { ROLES } from '@orm/role';

import { TaskStatusMove } from './task-status-move.entity';

import { TaskStatusMoveService } from './task-status-move.service';

@ApiTags('task-status-moves (roles: user(get), super-admin(create/edit/delete))')
@Crud({
  model: {
    type: TaskStatusMove,
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(TaskStatusMove).getMany, ROLES.SUPER_ADMIN)],
    },
    createOneBase: {
      decorators: [Auth(res(TaskStatusMove).createOne, ROLES.SUPER_ADMIN)],
    },
    updateOneBase: {
      decorators: [Auth(res(TaskStatusMove).updateOne, ROLES.SUPER_ADMIN)],
    },
    deleteOneBase: {
      decorators: [Auth(res(TaskStatusMove).deleteOne, ROLES.SUPER_ADMIN)],
    },
  },
})
@Controller('task-status-moves')
export class TaskStatusMoveController {
  // tslint:disable-next-line
  constructor(private readonly service: TaskStatusMoveService) {}
}
