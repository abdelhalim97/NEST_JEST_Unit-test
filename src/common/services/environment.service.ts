import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerEnvironmentEnum } from '../enums/server-environments.enum';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  get isProduction(): boolean {
    return this.configService.get<ServerEnvironmentEnum>('SERVER_ENV') === ServerEnvironmentEnum.PRODUCTION;
  }

  get serverConfig() {
    return {
      serverEnv: this.configService.get<string>('SERVER_ENV'),
      port: this.configService.get<number>('PORT'),
      serverUrl: this.configService.get<string>('SERVER_URL'),
    };
  }

  get frontInformation() {
    return {
      frontUrl: this.configService.get<string>('FRONT_URL'),
    };
  }

  get dataBaseConfig() {
    return {
      dataBaseURL: this.configService.get<string>('DATABASE_URL'),
    };
  }

  get jasonWebTokenConfig() {
    return {
      jWTSecretKey: this.configService.get<string>('JWT_SECRET_KEY'),
      saltRounds: Number(this.configService.get<number>('SALT_ROUNDS')),
    };
  }

  get smtp() {
    return {
      smtpHost: this.configService.get<string>('SMTP_HOST'),
      smtpPort: this.configService.get<number>('SMTP_PORT'),
      smtpUser: this.configService.get<string>('SMTP_USER'),
      smtpPassword: this.configService.get<string>('SMTP_PASSWORD'),
    };
  }

  get transporter(): SMTPTransport | SMTPTransport.Options | string {
    return {
      host: this.smtp.smtpHost,
      port: this.smtp.smtpPort,
      secure: true,
      auth: {
        user: this.smtp.smtpUser,
        pass: this.smtp.smtpPassword,
      },
    };
  }
}
