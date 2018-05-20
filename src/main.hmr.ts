import { NestFactory } from '@nestjs/core';
import { ParseIntPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { ValidationPipe } from './@common/pipes/validation.pipe';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(), new ParseIntPipe());
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
