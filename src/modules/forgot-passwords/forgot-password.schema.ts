import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/modules/users/user.schema';

export type ForgotPasswordDocument = HydratedDocument<ForgotPassword>;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class ForgotPassword {
  @Prop({ isRequired: true, index: true })
  @ApiProperty()
  ulid: string;

  @Prop({ default: false })
  @ApiProperty()
  isUsed: boolean;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  userId: User;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword);
