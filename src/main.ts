import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const IS_PROD = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || process.env.HOSTNAME || 'localhost';
const SCHEMA = IS_PROD ? 'https' : 'http';

const corsOptions = {
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  // exposedHeaders: [],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  origin: ['https://altiore.org', 'http://localhost:8181'],
  preflightContinue: true,
} as CorsOptions;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: corsOptions });
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
