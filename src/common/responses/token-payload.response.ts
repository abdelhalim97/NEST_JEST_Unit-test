import { Types } from 'mongoose';

export class TokenPayloadResponse {
  id: Types.ObjectId; //authed user id
  iat: number; //issued at
}
