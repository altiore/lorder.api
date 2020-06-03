import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

import getReferer from './@common/helpers/getReferer';
import { AppModule } from './app.module';
import { corsOptions } from './~options/corsOptions';
import { swaggerCustomOptions, swaggerOptions } from './~options/swaggerOptions';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = (process.env.PORT || 3000) as number;
const HOST = process.env.HOST || process.env.HOSTNAME || 'localhost';
const IS_PROD = process.env.NODE_ENV === 'production';
const SCHEMA = IS_PROD ? 'https' : 'http';

const whitelist = process.env.SERVER_ORIGIN_WHITELIST
  ? JSON.parse(process.env.SERVER_ORIGIN_WHITELIST)
  : process.env.SERVER_ORIGIN
    ? [process.env.SERVER_ORIGIN]
    : [];

function except(currentHost, paths, fn) {
  return function(req, res, next) {
    const refererHost = getReferer(req.get('referer'));
    // Не проверять CORS заголовки для запросов, посланных с того же домена и содержащих пути из списка paths

    if (refererHost === currentHost || (paths.includes(req.path) && req.method === 'POST')) {
      return next();
    }

    return fn(req, res, next);
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const currentHost = `${SCHEMA}://${HOST}`;
  const currentHostWithPort = currentHost + ([80, 443, '80', '443'].indexOf(PORT) === -1 ? ':' + PORT : '');

  if (process.env.SERVER_ORIGIN !== 'https://lorder.org') {
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('api', app, document, swaggerCustomOptions);
  }

  app.use(except(currentHost, ['/v1/webhooks'], cors(corsOptions(IS_PROD, whitelist))));

  await app.listen(
    PORT, // '0.0.0.0',
    () => {
      if (!IS_PROD) {
        /* tslint:disable */
        console.log(`Listening on ${currentHostWithPort}/api/`);
        /* tslint:enable */
      }
    }
  );
}

bootstrap();
