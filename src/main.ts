import {
  CorsOptions,
  CustomOrigin,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as helmet from 'helmet';

import { AppModule } from './app.module';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || process.env.HOSTNAME || 'localhost';
const SCHEMA = IS_PROD ? 'https' : 'http';

const whitelist = ['https://altiore.org', 'http://localhost:8181'];
const corsOptions = {
  allowedHeaders: 'Authorization,Accept,Content-Type',
  credentials: true,
  exposedHeaders: 'Authorization',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  } as CustomOrigin,
} as CorsOptions;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(helmet());
  app.setGlobalPrefix('v1');

  const options = new DocumentBuilder()
    .setTitle('Altiore')
    .setDescription('Altiore API documentation')
    .setVersion('1.0')
    .addBearerAuth('Authorization', 'header')
    .setSchemes(SCHEMA)
    .setBasePath('v1')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(
    PORT,
    /* tslint:disable */
    () =>
      process.env.NODE_ENV !== 'production' &&
      console.log(`Listening on ${SCHEMA}://${HOST}:${PORT}/api/`)
  );
}

bootstrap();
