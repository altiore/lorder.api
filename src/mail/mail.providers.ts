import { Provider } from '@nestjs/common';

import * as sgMail from '@sendgrid/mail';

import { MAIL_PROVIDER_SERVICE } from './mail.constants';
import { MailStub } from './mail.stub';

export function createMailProvider(): Provider<typeof sgMail.MailService> {
  return {
    provide: MAIL_PROVIDER_SERVICE,
    useFactory: (): typeof sgMail.MailService => {
      if (process.env.SENDGRID_API_KEY) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        return sgMail;
      }
      return new MailStub() as any;
    },
  };
}
