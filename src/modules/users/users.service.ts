import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async fetchUserById(id: string): Promise<User> {
    await this.isUserByIdExists(id);

    return await this.userModel.findOne({ _id: id });
  }

  async fetchUserByEmail(email: string): Promise<User> {
    await this.isEmailExists(email);

    return await this.userModel.findOne({ email }).exec();
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

  async isUserByIdExists(id: string): Promise<boolean> {
    const userByEmail = await this.userModel.findOne({ _id: id });

    if (!userByEmail) throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
    return true;
  }
}
