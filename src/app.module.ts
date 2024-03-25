import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentService } from 'src/common/services/environment.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ForgotPasswordsModule } from './modules/forgot-passwords/forgot-passwords.module';

@Module({
  imports: [
    CommonModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [CommonModule],
      inject: [EnvironmentService],
      useFactory: (environmentService: EnvironmentService) => {
        return {
          uri: environmentService.dataBaseConfig.dataBaseURL,
        };
      },
    }),
    AuthModule,
    UsersModule,
    ForgotPasswordsModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
