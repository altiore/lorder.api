import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';
import * as Mustache from 'mustache';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { MessageDto } from './dto/message.dto';
import { User } from '../@entities/user';

@Injectable()
export class MailService {
  constructor() {}

  /**
   * using SendGrid's v3 Node.js Library
   * @see https://github.com/sendgrid/sendgrid-nodejs
   */
  private async send(msg: MessageDto): Promise<[ClientResponse, {}]> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send(msg);
  }

  public sendInvite(user: User): Promise<[ClientResponse, {}]> {
    const output = Mustache.render(readFileSync(resolve(process.env.pwd, 'mails/invite.html'), 'utf8'), {
      LINK: 'https://google.com/test/link',
      LINK_NAME: 'Button Name',
    });
    return this.send({
      from: 'altiore@gmail.com',
      to: user.email,
      subject: 'Приглашение Altiore',
      html: output,
    });
  }
}
