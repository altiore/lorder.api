import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { corsOptions } from './~options/corsOptions';
import { swaggerCustomOptions, swaggerOptions } from './~options/swaggerOptions';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || process.env.HOSTNAME || 'localhost';
const IS_PROD = process.env.NODE_ENV === 'production';
const SCHEMA = IS_PROD ? 'https' : 'http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document, swaggerCustomOptions);

  // должно быть ПОСЛЕ создания SwaggerModule документа, чтоб swagger.ui был доступен без CORS
  app.enableCors(corsOptions(IS_PROD));

  await app.listen(
    PORT, // '0.0.0.0',
    () => {
      if (process.env.NODE_ENV !== 'production') {
        /* tslint:disable */
        console.log(`Listening on ${SCHEMA}://${HOST}:${PORT}/api/`);
        /* tslint:enable */
      }
    }
  );
}

bootstrap();
