import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @ApiProperty()
  _id: Types.ObjectId;

  @Prop({ isRequired: true })
  @ApiProperty()
  name: string;

  @Prop({ isRequired: true, unique: true })
  @ApiProperty()
  email: string;

  @Prop({ isRequired: true })
  @ApiProperty()
  password: string;

  @Prop({ isRequired: true })
  @ApiProperty()
  phone: string;

  @Prop({ default: null })
  @ApiProperty()
  profileImage: string;

  @Prop({ default: '216' })
  phoneCode: string; //most liekly we wont need this since 9at3a only for tunisian users but i m adding this for easy scale

  @Prop({ default: false })
  isValid: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
