import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';

export class UpdatePasswordDto extends PickType(RegisterUserDto, ['password', 'confirmPassword'] as const) {}
