import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
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

  @Prop()
  @ApiProperty()
  profileImage: string;

  @Prop({ default: '216' })
  phoneCode: string; //most liekly we wont need this since 9at3a only for tunisian users but i m adding this for easy scale

  @Prop({ default: false })
  isValid: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
