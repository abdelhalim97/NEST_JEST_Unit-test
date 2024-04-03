import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
  @ApiProperty()
  jwt: string;
}
