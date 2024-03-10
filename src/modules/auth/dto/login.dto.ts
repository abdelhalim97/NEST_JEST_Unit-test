import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';

export class LoginDto extends PickType(RegisterUserDto, ['email', 'password'] as const) {}
