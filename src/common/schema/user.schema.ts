import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
class withdrawalWallet {
  @Prop()
  walletAddress: string

  @Prop()
  amount: number

  @Prop()
  coin: string

  @Prop()
  network: string
}

@Schema({ timestamps: true})
class depositWallet {
  @Prop()
  amount: number

  @Prop()
  coin: string

  @Prop()
  recieptImage: string
}

@Schema({ timestamps: true})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phrase: string;

  @Prop({ default: 0.00 })
  balance: number;
  

  @Prop({ type: depositWallet})
  depositWallet: depositWallet

  @Prop({ type: ['pending', 'completed', 'failed']})
  depositStatus: 'pending' | 'completed' | 'failed'


  @Prop({type: withdrawalWallet})
  withdrawalWallet: withdrawalWallet;
  
  @Prop({ type: ['pending', 'completed', 'failed']})
  withdrawStatus: 'pending' | 'completed' | 'failed'
}

export const UserSchema = SchemaFactory.createForClass(User);