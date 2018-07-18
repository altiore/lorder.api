import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { ClientResponse } from '@sendgrid/client/src/response';
import * as Mustache from 'mustache';
import { readFileSync } from 'fs';
import { resolve } from 'path';

import { MailAcceptedDto, MessageDto } from './dto';

/**
 * каждое письмо соответсвует одноименному файлу в папке mjml
 * Например `invite` соответствует файлу mjml/invite.mjml
 */
export type IMailTemplate = 'invite' | 'magic';

@Injectable()
export class MailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  public static readonly ADMIN_EMAIL = 'razzwan@altiore.org';

  public sendInvite({
    email,
    inviter,
    link,
    member = 'Приятель',
    project,
  }: {
    email: string;
    inviter?: string;
    link: string;
    member?: string;
    project: string;
  }): Promise<MailAcceptedDto> {
    const output = this.putParamsToTemplate(MailService.INVITE_TEMPLATE, {
      LINK: link,
      MEMBER: member,
      INVITER: inviter || 'Администратор',
      PROJECT: project,
    });

    return this.send({
      from: MailService.ADMIN_EMAIL,
      to: email,
      subject: `Приглашение в проект ${project} (Altiore)`,
      html: output,
    });
  }

  public sendMagicLink(email: string, link: string): Promise<MailAcceptedDto> {
    const output = this.putParamsToTemplate(MailService.MAGIC_LINK, {
      EMAIL: email,
      LINK: link,
    });

    // const [res] = await this.send({
    return this.send({
      from: MailService.ADMIN_EMAIL,
      to: email,
      subject: 'Магическая ссылка Altiore',
      html: output,
    });
  }

  private static readonly INVITE_TEMPLATE = 'invite';
  private static readonly MAGIC_LINK = 'magic';

  /**
   * Render template: @see https://mjml.io/
   * Template generator: @see https://mjml.io/try-it-live
   * Put variables to template: @see https://github.com/janl/mustache.js
   */
  private putParamsToTemplate(template: IMailTemplate, params: object): string {
    return Mustache.render(readFileSync(resolve(process.cwd() + '/mails/', `${template}.html`), 'utf8'), params);
  }

  /**
   * Отправка почты. Можно поменять способ отправки здесь, чтоб почта отправлялась любым другим способом.
   */
  private send(msg: MessageDto): Promise<MailAcceptedDto> {
    return this.sendWithSendGrid(msg);
  }

  /**
   * Email sending approach SendGrid
   *
   * Using SendGrid's v3 Node.js Library:
   * @see https://github.com/sendgrid/sendgrid-nodejs
   *
   * Full documentation here:
   * @see https://sendgrid.com/docs/API_Reference/Web_API_v3/index.html
   */
  private async sendWithSendGrid(msg: MessageDto): Promise<MailAcceptedDto> {
    const [res] = (await sgMail.send(msg)) as [ClientResponse, {}];
    return {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    };
  }
}
