import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

export class RegisterUserDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty()
  password: string;

  @Match('password')
  @IsString()
  @ApiProperty()
  confirmPassword: string;
}
