import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

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

function except(paths, fn) {
  return function (req, res, next) {
    if (paths.includes(req.path)) {
      return next();
    }

    return fn(req, res, next)
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const currentOrigin = process.env.SERVER_ORIGIN || `${SCHEMA}://${HOST}${[80, 433, '80', '433'].indexOf(PORT) === -1 ? ':'+PORT : ''}`;

  if (currentOrigin !== 'https://altiore.org') {
    const document = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('api', app, document, swaggerCustomOptions);
  }

  app.use(except(['/v1/webhooks'], cors(corsOptions(IS_PROD, currentOrigin))));

  await app.listen(
    PORT, // '0.0.0.0',
    () => {
      if (!IS_PROD) {
        /* tslint:disable */
        console.log(`Listening on ${currentOrigin}/api/`);
        /* tslint:enable */
      }
    }
  );
}

bootstrap();
