import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { User } from 'src/modules/users/user.schema';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: User })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<User> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiCreatedResponse({ type: User })
  async login(@Body() loginDto: LoginDto): Promise<{ jwt: string }> {
    return this.authService.login(loginDto);
  }
}
