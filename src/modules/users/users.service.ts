import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SuccessResponse } from 'src/common/responses/success.response';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { UpdatePasswordDto } from 'src/modules/auth/dto/update-password.dto';
import { User } from 'src/modules/users/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private bcryptService: BcryptService,
  ) {}

  async updatePassword(updatePasswordDto: UpdatePasswordDto, id: Types.ObjectId): Promise<SuccessResponse> {
    const { password } = updatePasswordDto;
    await this.fetchUserById(id);

    const hashedPassword = await this.bcryptService.hash(password);

    await this.userModel.updateOne({ _id: id }, { password: hashedPassword });

    return { success: true };
  }

  async fetchUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);

    return user;
  }

  async fetchUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).lean();

    if (!user) throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);

    return user;
  }

  async isEmailNotExists(email: string): Promise<boolean> {
    const userByEmail = await this.userModel.findOne({ email });

    if (userByEmail) throw new HttpException('Email exists!', HttpStatus.CONFLICT);
    return true;
  }
}
