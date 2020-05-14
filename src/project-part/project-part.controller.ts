import { Auth, res } from '@common/decorators';
import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { Project } from '@orm/project';
import { ProjectPart } from '@orm/project-part/project-part.entity';
import { ROLES } from '@orm/role';
import { ACCESS_LEVEL } from '@orm/user-project';

import { ProjectPartService } from './project-part.service';

@ApiTags('project-parts (roles: user)')
@Crud({
  model: {
    type: ProjectPart,
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
      decorators: [Auth(res(ProjectPart).getMany, ROLES.USER, ACCESS_LEVEL.RED)],
    },
    deleteOneBase: {
      decorators: [Auth(res(ProjectPart).deleteOne, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
    updateOneBase: {
      decorators: [Auth(res(ProjectPart).updateOne, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@Controller('projects/:projectId/parts')
export class ProjectPartController implements CrudController<ProjectPart> {
  // tslint:disable-next-line
  constructor(readonly service: ProjectPartService) {}

  get base(): CrudController<ProjectPart> {
    return this;
  }

  @Auth(res(ProjectPart).createOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: ProjectPart,
    @Param('projectId', ParseIntPipe) projectId: number
  ) {
    return this.base.createOneBase(req, { ...dto, project: { id: projectId } as Project });
  }
}
