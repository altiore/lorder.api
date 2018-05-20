import { NestFactory } from '@nestjs/core';
import { ParseIntPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ValidationPipe } from './@common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(), new ParseIntPipe());
  await app.listen(3000);
}
bootstrap();
