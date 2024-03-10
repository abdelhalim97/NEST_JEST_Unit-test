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
}

export const UserSchema = SchemaFactory.createForClass(User);
