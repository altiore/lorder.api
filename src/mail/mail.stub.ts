import { ClientResponse } from '@sendgrid/client/src/response';
import { MailData } from '@sendgrid/helpers/classes/mail';

export class MailStub {
  public async send(msg: MailData): Promise<[ClientResponse, {}]> {
    /* tslint:disable */
    console.log(`Ссылка, чтоб войти: ${msg.dynamicTemplateData?.LINK}`);
    /* tslint:enable */
    const clientResponse = {
      statusCode: 301,
      statusMessage: 'почта отправлена в консоль',
    } as ClientResponse;
    return Promise.resolve([clientResponse, {}]);
  }
}
