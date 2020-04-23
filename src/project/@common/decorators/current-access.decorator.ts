import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAccessParam = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.accessLevel;
});
