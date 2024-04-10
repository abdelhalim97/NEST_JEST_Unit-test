import { IntersectionType } from '@nestjs/swagger';
import { JwtResponse } from 'src/common/responses/jwt.response';
import { User } from 'src/modules/users/user.schema';

export class JwtUserResponse extends IntersectionType(User, JwtResponse) {}
