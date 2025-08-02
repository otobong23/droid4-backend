import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserTransactionDocument = UserTransaction & Document;

@Schema({ timestamps: true })
export class UserTransaction {
  @Prop({ type: String, ref: 'user', required: true })
  email: string;

  @Prop({ required: true, enum: ['deposit', 'withdrawal', 'plans', 'yield', 'swap'] })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending', enum: ['pending', 'completed', 'failed'] })
  status: string;

  @Prop({ type: String })
  Coin: string; // e.g. 'USDT', 'BTC'

  @Prop({ type: String })
  fromCoin

  @Prop({ default: null })
  network: string;

  @Prop({ type: String })
  note: string

  @Prop({ type: String })
  image: string

  @Prop({ type: String })
  withdrawWalletAddress: string

  @Prop({ type: Date })
  date: Date;
}

export const UserTransactionSchema = SchemaFactory.createForClass(UserTransaction);