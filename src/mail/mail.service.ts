import { Inject, Injectable } from '@nestjs/common';

import { ClientResponse } from '@sendgrid/client/src/response';
import { MailData } from '@sendgrid/helpers/classes/mail';
import { MailService as SendGridMailService } from '@sendgrid/mail';
import * as Mustache from 'mustache';

import { readFileSync } from 'fs';
import { resolve } from 'path';

import { MailAcceptedDto } from './dto';
import { MAIL_PROVIDER_SERVICE } from './mail.constants';

/**
 * каждое письмо соответсвует одноименному файлу в папке mjml
 * Например `invite` соответствует файлу mjml/invite.mjml
 */
export type IMailTemplate = 'invite' | 'magic';

@Injectable()
export class MailService {
  public static readonly ADMIN_EMAIL = {
    email: 'noreplay@lorder.org',
    name: 'Lorder.org',
  };

  private static readonly INVITE_TEMPLATE = 'invite';
  private static readonly MAGIC_LINK = 'magic';

  constructor(@Inject(MAIL_PROVIDER_SERVICE) private readonly mailService: typeof SendGridMailService) {}

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
      INVITER: inviter || 'Администратор',
      LINK: link,
      MEMBER: member,
      PROJECT: project,
    });

    return this.send({
      from: MailService.ADMIN_EMAIL,
      html: output,
      subject: `Приглашение в проект ${project} (Lorder)`,
      to: email,
    });
  }

  public sendMagicLink(email: string, link: string): Promise<MailAcceptedDto> {
    const dynamicTemplateData = {
      EMAIL: email,
      LINK: link,
    };
    const output = this.putParamsToTemplate(MailService.MAGIC_LINK, dynamicTemplateData);

    return this.send({
      dynamicTemplateData,
      from: MailService.ADMIN_EMAIL,
      html: output,
      subject: 'Магическая ссылка Lorder',
      to: email,
    });
  }

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
  private send(msg: MailData): Promise<MailAcceptedDto> {
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
  private async sendWithSendGrid(msg: MailData): Promise<MailAcceptedDto> {
    const [res] = (await this.mailService.send(msg)) as [ClientResponse, {}];
    return {
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    };
  }
}
