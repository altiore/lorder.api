import { DocumentBuilder, SwaggerCustomOptions } from '@nestjs/swagger';
import * as fs from 'fs';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('Altiore')
  .setVersion('1.0')
  .setDescription('Altiore API documentation')
  .addBearerAuth({
    in: 'header',
    name: 'Authorization',
    type: 'apiKey',
  })
  .build();

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customCss: fs.readFileSync(__dirname + '/../../public/static/swagger.css', 'utf8'),
  customJs: '/static/swagger.js',
  customSiteTitle: 'Altiore Swagger UI',
};
