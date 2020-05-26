import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { createHmac, timingSafeEqual } from 'crypto';
import { Repository } from 'typeorm';

import { WebHook } from '@orm/webhook/webhook.entity';

@Injectable()
export class WebHooksService extends TypeOrmCrudService<WebHook> {
  constructor(@InjectRepository(WebHook) repo: Repository<WebHook>) {
    super(repo);
  }

  public async postWebHook(webHook: object, sig: string): Promise<void> {
    const hmac = createHmac('sha1', process.env.GIT_HUB_WEBHOOKS_SECRET);
    const digest = Buffer.from('sha1=' + hmac.update(JSON.stringify(webHook)).digest('hex'), 'utf8');
    const checksum = Buffer.from(sig, 'utf8');
    if (checksum.length !== digest.length || !timingSafeEqual(digest, checksum)) {
      // Запрос НЕ прошел проверку!!!
      return;
    }

    const model = new WebHook();
    model.data = webHook;
    await this.repo.save(model);
  }
}
