import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/responses/success.response';
import { AuthService } from 'src/modules/auth/auth.service';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { UpdatePasswordDto } from 'src/modules/auth/dto/update-password.dto';
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

  @Post('forgot-password')
  @ApiCreatedResponse({ type: User })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('reset-password/:key')
  @ApiOkResponse({ type: SuccessResponse })
  async resetPassword(@Body() updatePasswordDto: UpdatePasswordDto, @Param('key') key: string): Promise<SuccessResponse> {
    return this.authService.resetPassword(updatePasswordDto, key);
  }
}
