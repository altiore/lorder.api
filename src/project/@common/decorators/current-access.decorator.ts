import { createParamDecorator } from '@nestjs/common';

export const CurrentAccessParam = createParamDecorator((data, req) => {
  return req.accessLevel;
});
