import { Request } from 'express';
import { TokenPayloadResponse } from 'src/common/responses/token-payload.response';

export interface GetUserAuthInfoRequestI extends Request {
  user: TokenPayloadResponse;
}
