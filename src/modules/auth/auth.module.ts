import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/modules/users/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { EnvironmentService } from 'src/common/services/environment.service';
import { ForgotPasswordsModule } from 'src/modules/forgot-passwords/forgot-passwords.module';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [CommonModule],
      inject: [EnvironmentService],
      useFactory: async (environmentService: EnvironmentService) => {
        return { secret: environmentService.jasonWebTokenConfig.JWTSecretKey };
      },
    }),
    UsersModule,
    ForgotPasswordsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
})
export class AuthModule {}
