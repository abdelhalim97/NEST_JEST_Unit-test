import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from 'src/common/responses/token-payload.response';

export const User = createParamDecorator((data: string, ctx: ExecutionContext): TokenPayload => {
  const { user } = ctx.switchToHttp().getRequest();
  return data ? user[data] : user;
});
