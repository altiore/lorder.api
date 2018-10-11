import { createParamDecorator } from '@nestjs/common';

export const ProjectParam = createParamDecorator((data, req) => {
  return req.project;
});
