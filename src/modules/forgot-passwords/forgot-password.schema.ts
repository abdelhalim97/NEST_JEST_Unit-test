import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type ForgotPasswordDocument = HydratedDocument<ForgotPassword>;

@Schema({ timestamps: { createdAt: true } })
export class ForgotPassword {
  @Prop({ isRequired: true, index: true })
  @ApiProperty()
  ulid: string;

  @Prop({ isRequired: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  userId: Types.ObjectId;

  @ApiProperty()
  createdAt: Date;
}

export const ForgotPasswordSchema = SchemaFactory.createForClass(ForgotPassword).index({ createdAt: 1 });
