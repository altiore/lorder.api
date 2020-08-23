import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';

import { Repository } from 'typeorm';

import { WebHook } from '@orm/entities/webhook.entity';

import { checkGitHubSig } from './webhooks.sig-checker';

@Injectable()
export class WebHooksService extends TypeOrmCrudService<WebHook> {
  constructor(@InjectRepository(WebHook) repo: Repository<WebHook>) {
    super(repo);
  }

  public async postWebHook(webHook: object, sig: string): Promise<WebHook> {
    if (checkGitHubSig(sig, webHook, process.env.GIT_HUB_WEBHOOKS_SECRET)) {
      const model = new WebHook();
      model.data = webHook;
      return await this.repo.save(model);
    }

    throw new NotAcceptableException('Sig is failed!');
  }
}
