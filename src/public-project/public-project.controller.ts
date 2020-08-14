import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { ProjectPub } from '@orm/project-pub';

import { res, UnAuth } from '@common/decorators';

import { PublicProjectService } from './public-project.service';

@ApiTags('public-projects (roles: USER)')
@Crud({
  model: {
    type: ProjectPub,
  },
  routes: {
    only: ['getManyBase', 'getOneBase'],
    getManyBase: {
      decorators: [UnAuth(res(ProjectPub).getMany)],
    },
    getOneBase: {
      decorators: [UnAuth(res(ProjectPub).getOne)],
    },
  },
  params: {
    uuid: {
      field: 'uuid',
      type: 'string',
      primary: true,
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@Controller('public-projects')
export class PublicProjectController {
  constructor(private readonly service: PublicProjectService) {}
}
