import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerEnvironmentEnum } from '../enums/server-environments.enum';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get isProduction(): boolean {
    return (
      this.configService.get<string>('SERVER_ENV') ===
      ServerEnvironmentEnum.PRODUCTION
    );
  }

  get serverConfig() {
    return {
      serverEnv: this.configService.get<string>('SERVER_ENV'),
      port: this.configService.get<number>('PORT'),
      serverURL: this.configService.get<number>('SERVER_URL'),
    };
  }

  get dataBaseConfig() {
    return {
      dataBaseURL: this.configService.get<string>('DATABASE_URL'),
    };
  }

  get jasonWebTokenConfig() {
    return {
      JWTSecretKey: this.configService.get<string>('JWT_SECRET_KEY'),
      saltRounds: this.configService.get<number>('SALT_ROUNDS'),
    };
  }
}
