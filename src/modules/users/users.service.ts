import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SuccessResponse } from 'src/common/responses/success.response';
import { CommonService } from 'src/common/services/common.service';
import { UpdatePasswordDto } from 'src/modules/auth/dto/update-password.dto';
import { User } from 'src/modules/users/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private commonService: CommonService,
  ) {}

  async updatePassword(updatePasswordDto: UpdatePasswordDto, id: Types.ObjectId): Promise<SuccessResponse> {
    const { password } = updatePasswordDto;
    await this.isUserByIdExists(id);

    const hashedPassword = await this.commonService.hash(password);

    await this.userModel.updateOne({ _id: id }, { password: hashedPassword });

    return { success: true };
  }

  async fetchUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);

    return user;
  }

  async fetchUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();

    if (!user) throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);

    return user;
  }

  async isEmailExists(email: string): Promise<boolean> {
    const userByEmail = await this.userModel.findOne({ email });

    if (!userByEmail) throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);
    return true;
  }

  async isEmailNotExists(email: string): Promise<boolean> {
    const userByEmail = await this.userModel.findOne({ email });

    if (userByEmail) throw new HttpException('Email exists!', HttpStatus.CONFLICT);
    return true;
  }

  async isUserByIdExists(id: Types.ObjectId): Promise<boolean> {
    const userByEmail = await this.userModel.findOne({ _id: id });

    if (!userByEmail) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    return true;
  }
}
