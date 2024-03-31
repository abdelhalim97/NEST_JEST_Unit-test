import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as nodemailer from 'nodemailer';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { EnvironmentService } from 'src/common/services/environment.service';
import { Model, Types } from 'mongoose';
import { User } from 'src/modules/users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { SuccessResponse } from 'src/common/responses/success.response';
import { ForgotPasswordsService } from 'src/modules/forgot-passwords/forgot-passwords.service';
import { UpdatePasswordDto } from 'src/modules/auth/dto/update-password.dto';
import { ForgotPasswordDto } from 'src/modules/auth/dto/forgot-password.dto';
import { CommonService } from 'src/common/services/common.service';
import { JwtUserResponse } from 'src/modules/auth/reponse/jwt-user.response';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly forgotPasswordsService: ForgotPasswordsService,
    private readonly environmentService: EnvironmentService,
    private commonService: CommonService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private JwtSecret = this.environmentService.jasonWebTokenConfig.JWTSecretKey;
  private smtpEmail = this.environmentService.smtp.smtpUser;
  private frontUrl = this.environmentService.frontInformation.frontUrl;

  private transporter = nodemailer.createTransport({
    host: this.environmentService.smtp.smtpHost,
    port: this.environmentService.smtp.smtpPort,
    secure: true,
    auth: {
      user: this.smtpEmail,
      pass: this.environmentService.smtp.smtpPassword,
    },
  });

  async register(registerUserDto: RegisterUserDto): Promise<JwtUserResponse> {
    const { email, password } = registerUserDto;
    const hashedPassword = await this.commonService.hash(password);

    await this.usersService.isEmailNotExists(email);
    const userCreated = await this.userModel.create({
      ...registerUserDto,
      password: hashedPassword,
      confirmPassword: undefined,
    });

    const token = await this.generateBearerToken(userCreated._id);
    return { ...userCreated, jwt: token };
  }

  async login(loginDto: LoginDto): Promise<JwtUserResponse> {
    const { email, password } = loginDto;

    const fetcheduser = await this.usersService.fetchUserByEmail(email);

    await this.commonService.isPasswordCorrect(password, fetcheduser.password);

    const jwt = await this.generateBearerToken(fetcheduser._id);
    return { ...fetcheduser, jwt };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<SuccessResponse> {
    const { email } = forgotPasswordDto;
    const user = await this.userModel.findOne({ email }).exec(); //We should not indecate to the user that email exists or not for security

    if (user) {
      const createdForgotPassword = await this.forgotPasswordsService.createForgotPassword(user._id);

      this.transporter.sendMail({
        from: this.smtpEmail,
        to: email,
        subject: 'Reset password',
        text: `You can use this link to reset your password ${this.frontUrl}[forgot password front redirection]/?key=${createdForgotPassword.ulid}.\n
        This link expires after 1 hour and cannot be reused.`,
      });
    }

    return { success: true };
  }

  async resetPassword(updatePasswordDto: UpdatePasswordDto, key: string): Promise<SuccessResponse> {
    const forgotPassword = await this.forgotPasswordsService.findForgotPasswordByUlid(key);

    await this.usersService.updatePassword(updatePasswordDto, forgotPassword.userId);

    await this.forgotPasswordsService.deleteForgotPasswordByUlid(forgotPassword.ulid);
    return { success: true };
  }

  async generateBearerToken(userId: Types.ObjectId): Promise<string> {
    const payload = { id: userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.JwtSecret,
    });
  }
}
