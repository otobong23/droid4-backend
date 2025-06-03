import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phrase: string;
  
  @Prop()
  depositWallet: string

  @Prop({ type: ['pending', 'completed', 'failed']})
  depositStatus: 'pending' | 'completed' | 'failed'

  @Prop()
  withdrawalWallet: string
  
  @Prop({ type: ['pending', 'completed', 'failed']})
  withdrawStatus: 'pending' | 'completed' | 'failed'
}

export const UserSchema = SchemaFactory.createForClass(User);