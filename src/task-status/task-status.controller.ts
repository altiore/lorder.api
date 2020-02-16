import { Auth, res } from '@common/decorators';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { ROLES } from '@orm/role';

import { TaskStatus } from './task-status.entity';

import { TaskStatusService } from './task-status.service';

@ApiTags('task-statuses (roles: user(get), super-admin(create/edit/delete))')
@Crud({
  model: {
    type: TaskStatus,
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(TaskStatus).getMany, ROLES.SUPER_ADMIN)],
    },
    createOneBase: {
      decorators: [Auth(res(TaskStatus).createOne, ROLES.SUPER_ADMIN)],
    },
    updateOneBase: {
      decorators: [Auth(res(TaskStatus).updateOne, ROLES.SUPER_ADMIN)],
    },
    deleteOneBase: {
      decorators: [Auth(res(TaskStatus).deleteOne, ROLES.SUPER_ADMIN)],
    },
  },
})
@Controller('task-statuses')
export class TaskStatusController {
  // tslint:disable-next-line
  constructor(private readonly service: TaskStatusService) {}
}
