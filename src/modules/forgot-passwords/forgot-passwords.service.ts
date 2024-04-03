import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SuccessResponse } from 'src/common/responses/success.response';
import { CommonService } from 'src/common/services/common.service';
import { ForgotPassword } from 'src/modules/forgot-passwords/forgot-password.schema';
import { ulid } from 'ulid';

@Injectable()
export class ForgotPasswordsService {
  constructor(
    @InjectModel(ForgotPassword.name) private forgotPasswordModel: Model<ForgotPassword>,
    private commonService: CommonService,
  ) {}

  async createForgotPassword(userId: Types.ObjectId): Promise<ForgotPassword> {
    const generatedUlid = ulid();

    return await this.forgotPasswordModel.create({ ulid: generatedUlid, userId });
  }

  async findForgotPasswordByUlid(ulid: string): Promise<ForgotPassword> {
    const forgotPassword = await this.isForgotPasswordByUlidExists(ulid);

    const remainingTime = this.commonService.remainingTime(forgotPassword.createdAt);
    const remainingTimeToHours = this.commonService.millisecondsToHours(remainingTime);

    if (remainingTimeToHours > 1) throw new HttpException('Link expired!', HttpStatus.GONE);
    return forgotPassword;
  }

  async deleteForgotPasswordByUlid(ulid: string): Promise<SuccessResponse> {
    //i m not querying if document exists and handling returning error because msot likely findForgotPasswordByUlid fundtion is running before this function
    await this.forgotPasswordModel.deleteOne({ ulid });

    return { success: true };
  }

  async isForgotPasswordByUlidExists(ulid: string): Promise<ForgotPassword> {
    const forgotPassword = await this.forgotPasswordModel.findOne({ ulid }).lean();

    if (!forgotPassword) throw new HttpException('Rest password request either not found or used!', HttpStatus.NOT_FOUND);

    return forgotPassword;
  }
}
