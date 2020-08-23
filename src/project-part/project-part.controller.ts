import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@nestjsx/crud';

import { get } from 'lodash';

import { ProjectPart } from '@orm/entities/project-part.entity';
import { Project } from '@orm/entities/project.entity';
import { ROLES } from '@orm/entities/role.entity';
import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';

import { Auth, res } from '@common/decorators';

import { ProjectPartService } from './project-part.service';

@ApiTags('project-parts (roles: user)')
@Crud({
  model: {
    type: ProjectPart,
  },
  params: {
    projectId: {
      field: '"ProjectPart"."projectId"',
      disabled: false,
      primary: false,
      type: 'number',
    },
  },
  routes: {
    only: ['getManyBase', 'createOneBase', 'updateOneBase', 'deleteOneBase'],
    getManyBase: {
      decorators: [Auth(res(ProjectPart).getMany, ROLES.USER, ACCESS_LEVEL.RED)],
    },
    updateOneBase: {
      decorators: [Auth(res(ProjectPart).updateOne, ROLES.USER, ACCESS_LEVEL.VIOLET)],
    },
  },
  query: {
    alwaysPaginate: true,
    join: {
      tasks: {
        allow: ['id'],
        eager: true,
      },
    },
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

  @Auth(res(ProjectPart).createOne, ROLES.USER, ACCESS_LEVEL.VIOLET)
  @Override()
  async deleteOne(@ParsedRequest() req: CrudRequest) {
    const curId = get(req, ['parsed', 'paramsFilter', 0, 'value']);
    await this.service.checkCanRemove(curId);
    return this.base.deleteOneBase(req);
  }
}
