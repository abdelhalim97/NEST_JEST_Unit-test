import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadResponse } from 'src/common/responses/token-payload.response';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): TokenPayloadResponse => {
  const { user } = ctx.switchToHttp().getRequest();
  return data ? user[data] : user;
});
