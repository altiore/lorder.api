import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud } from '@nestjsx/crud';

import { Auth, res } from '../@common/decorators';
import { ROLES } from '../@orm/entities/role.entity';
import { Session } from '../@orm/entities/session.entity';

@ApiTags('sessions')
@Crud({
  model: {
    type: Session,
  },
  routes: {
    only: ['getManyBase'],
    getManyBase: {
      decorators: [Auth(res(Session).getMany, ROLES.SUPER_ADMIN)],
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@Controller('sessions')
export class SessionsController {}
