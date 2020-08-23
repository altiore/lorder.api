import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebHook } from '@orm/entities/webhook.entity';

import { WebHooksController } from './webhooks.controller';
import { WebHooksService } from './webhooks.service';

@Module({
  controllers: [WebHooksController],
  exports: [WebHooksService],
  imports: [TypeOrmModule.forFeature([WebHook])],
  providers: [WebHooksService],
})
export class WebHooksModule {}
