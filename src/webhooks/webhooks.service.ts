import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { Repository } from 'typeorm';

import { WebHook } from '@orm/webhook/webhook.entity';

@Injectable()
export class WebHooksService extends TypeOrmCrudService<WebHook> {
  constructor(@InjectRepository(WebHook) repo: Repository<WebHook>) {
    super(repo);
  }

  public async postWebHook(webHook): Promise<void> {
    const model = new WebHook();
    model.data = webHook;
    await this.repo.save(model);
  }
}
