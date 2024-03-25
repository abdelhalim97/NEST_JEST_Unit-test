import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayloadResponse } from 'src/common/responses/token-payload.response';

export const User = createParamDecorator((_: string, ctx: ExecutionContext): TokenPayloadResponse => {
  const user: TokenPayloadResponse = ctx.switchToHttp().getRequest();

  return user;
});
