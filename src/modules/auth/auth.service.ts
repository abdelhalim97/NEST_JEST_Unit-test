import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterUserDto } from 'src/modules/auth/dto/register-user.dto';
import { EnvironmentService } from 'src/common/services/environment.service';
import { Model, Types } from 'mongoose';
import { User } from 'src/modules/users/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { LoginDto } from 'src/modules/auth/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly environmentService: EnvironmentService,
    private jwtService: JwtService,

    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  private saltOrRounds = this.environmentService.jasonWebTokenConfig.saltRounds;
  private JwtSecret = this.environmentService.jasonWebTokenConfig.JWTSecretKey;

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, name } = registerUserDto;
    const hashedPassword = await bcrypt.hash(password, Number(this.saltOrRounds));

    await this.usersService.isEmailNotExists(email);

    return await this.userModel.create({
      email,
      password: hashedPassword,
      name,
    });
  }

  async login(loginDto: LoginDto): Promise<{ jwt: string }> {
    const { email, password } = loginDto;
    const fetcheduser = await this.usersService.fetchUserByEmail(email);

    const hashedPassword = await bcrypt.compare(password, fetcheduser.password);

    if (!hashedPassword) throw new HttpException('Wrong credentials', HttpStatus.UNAUTHORIZED);

    const jwt = await this.generateBearerToken(fetcheduser._id);
    return { jwt };
  }

  async generateBearerToken(userId: Types.ObjectId): Promise<string> {
    const payload = { id: userId };
    return await this.jwtService.signAsync(payload, {
      secret: this.JwtSecret,
    });
  }
}
