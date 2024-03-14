import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ForgotPassword } from 'src/modules/forgot-passwords/forgot-password.schema';
import { ulid } from 'ulid';

@Injectable()
export class ForgotPasswordsService {
  constructor(@InjectModel(ForgotPassword.name) private forgotPasswordModel: Model<ForgotPassword>) {}

  async createForgetPassword(userId: Types.ObjectId): Promise<ForgotPassword> {
    const generatedUlid = ulid();

    return await this.forgotPasswordModel.create({ ulid: generatedUlid, userId });
  }
}
