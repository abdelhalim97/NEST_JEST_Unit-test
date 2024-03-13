import { PickType } from '@nestjs/swagger';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';

export class ForgetPasswordDto extends PickType(RegisterUserDto, ['email'] as const) {}
