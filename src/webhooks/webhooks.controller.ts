import { Body, Controller, Headers } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Crud, CrudController, Override } from '@nestjsx/crud';

import { ROLES } from '@orm/entities/role.entity';
import { WebHook } from '@orm/entities/webhook.entity';

import { Auth, res } from '@common/decorators';

import { WebHooksService } from './webhooks.service';

const sigHeaderName = 'x-hub-signature';

@ApiTags('webHooks')
@Crud({
  model: {
    type: WebHook,
  },
  routes: {
    only: ['getManyBase', 'createOneBase'],
    getManyBase: {
      decorators: [Auth(res(WebHook).getMany, ROLES.SUPER_ADMIN)],
    },
  },
  query: {
    alwaysPaginate: true,
  },
})
@Controller('webhooks')
export class WebHooksController implements CrudController<WebHook> {
  // tslint:disable-next-line
  constructor(readonly service: WebHooksService) {}

  get base(): CrudController<WebHook> {
    return this;
  }

  @Override()
  async createOne(@Headers(sigHeaderName) sig: string, @Body() webHook: object): Promise<any> {
    try {
      await this.service.postWebHook(webHook, sig);
      return 'OK';
    } catch (e) {
      return {
        action: ((webHook || { action: 'NO ACTION' }) as any).action,
        error: e,
        sig,
      };
    }
  }
}
