import { Module } from '@nestjs/common';
import { ForgotPasswordsController } from './forgot-passwords.controller';
import { ForgotPasswordsService } from './forgot-passwords.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ForgotPassword, ForgotPasswordSchema } from 'src/modules/forgot-passwords/forgot-password.schema';

@Module({
  controllers: [ForgotPasswordsController],
  providers: [ForgotPasswordsService],
  imports: [MongooseModule.forFeature([{ name: ForgotPassword.name, schema: ForgotPasswordSchema }])],
  exports: [ForgotPasswordsService],
})
export class ForgotPasswordsModule {}
