import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || process.env.HOSTNAME || 'localhost';
const SCHEMA = process.env.NODE_ENV === 'production' ? 'https' : 'http';

const corsOptions = {
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true,
  exposedHeaders: [],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  origin: ['https://altiore.org', 'http://localhost:8181'],
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
