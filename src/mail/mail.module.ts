import { Module } from '@nestjs/common';

import { createMailProvider } from './mail.providers';
import { MailService } from './mail.service';

@Module({
  exports: [MailService],
  providers: [MailService, createMailProvider()],
})
export class MailModule {}
