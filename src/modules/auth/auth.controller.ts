import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/common/responses/success.response';
import { AuthService } from 'src/modules/auth/auth.service';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { UpdatePasswordDto } from 'src/modules/auth/dto/update-password.dto';
import { JwtUserResponse } from 'src/modules/auth/reponse/jwt-user.response';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: JwtUserResponse })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<JwtUserResponse> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  @ApiCreatedResponse({ type: JwtUserResponse })
  async login(@Body() loginDto: LoginDto): Promise<JwtUserResponse> {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  @ApiCreatedResponse({ type: SuccessResponse })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<SuccessResponse> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('reset-password/:key')
  @ApiOkResponse({ type: SuccessResponse })
  async resetPassword(@Body() updatePasswordDto: UpdatePasswordDto, @Param('key') key: string): Promise<SuccessResponse> {
    return this.authService.resetPassword(updatePasswordDto, key);
  }
}
