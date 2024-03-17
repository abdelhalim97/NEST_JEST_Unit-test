import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, MaxLength, MinLength } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

export class RegisterUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'abdelhalim@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  @ApiProperty({ example: '123456' })
  password: string;

  @Match('password', { message: 'Password and confirm password are different!' })
  @IsString()
  @ApiProperty({ example: '123456' })
  confirmPassword: string;

  @IsNumberString()
  @MinLength(3)
  @MaxLength(20)
  @ApiProperty({ example: '99999999' })
  phone: string;
}
