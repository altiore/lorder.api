import { Auth, res } from '@common/decorators';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { ProjectRoleAllowedMove } from '@orm/project-role-allowed-move/project-role-allowed-move.entity';
import { ROLES } from '@orm/role';
import { ACCESS_LEVEL } from '@orm/user-project';

import { ProjectStatusMoveService } from './project.status-move.service';

@ApiTags('project.status-move')
@Crud({
  model: {
    type: ProjectRoleAllowedMove,
  },
  params: {
    projectId: {
      disabled: true,
      primary: false,
      type: 'number',
    },
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(ProjectRoleAllowedMove).getMany, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
    createOneBase: {
      decorators: [Auth(res(ProjectRoleAllowedMove).createOne, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
    updateOneBase: {
      decorators: [Auth(res(ProjectRoleAllowedMove).updateOne, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
    deleteOneBase: {
      decorators: [Auth(res(ProjectRoleAllowedMove).deleteOne, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@Controller('projects/:projectId/project-status-move')
export class ProjectStatusMoveController {
  // tslint:disable-next-line
  constructor(private readonly service: ProjectStatusMoveService) {}
}
