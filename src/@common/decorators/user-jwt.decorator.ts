import { createParamDecorator } from '@nestjs/common';

export const UserJWT = createParamDecorator((data, req) => {
  return req.user;
});
