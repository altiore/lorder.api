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
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  private static readonly INVITE_TEMPLATE = 'invite';

  /**
   * using SendGrid's v3 Node.js Library
   * @see https://github.com/sendgrid/sendgrid-nodejs
   */
  private send(msg: MessageDto): Promise<[ClientResponse, {}]> {
    return sgMail.send(msg);
  }

  /**
   * Render template: @see https://mjml.io/
   * Put variables to template: @see https://github.com/janl/mustache.js
   */
  private putParamsToTemplate(template: 'invite', params: object): string {
    return Mustache.render(readFileSync(resolve(process.env.MAILS_PATH, `${template}.html`), 'utf8'), params);
  }

  public sendInvite(user: User): Promise<[ClientResponse, {}]> {
    const output = this.putParamsToTemplate(MailService.INVITE_TEMPLATE, {
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
