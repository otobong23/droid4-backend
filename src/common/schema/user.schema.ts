import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Type } from 'class-transformer';

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

@Schema({ timestamps: true })
class depositWallet {
  @Prop()
  amount: number

  @Prop()
  coin: string

  @Prop()
  recieptImage: string
}

@Schema()
export class USDTAddress {
  @Prop() name: string;
  @Prop() address: string;
}
export const USDTAddressSchema = SchemaFactory.createForClass(USDTAddress);

@Schema()
export class WalletAddresses {
  @Prop({ default: "bc1q2v4cjsmeg05shfk28stvc74dy8cfa2k2j32hlp" }) BTC: string;
  @Prop({ default: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) ETH: string;
  @Prop({ default: "9PwLjinV7riyVhe4PjseZBJw2y7wt8uoWa1wqTyX8pfV" }) SOL: string;
  @Prop({ default: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) BNB: string;
  @Prop({ default: "rLNwyfNs8YwapeBRJhj5igj3NRMZGiNufQ" }) XRP: string;
  @Prop({ default: "ltc1q6qxqkk9ztf46r8z4504s4v8dzrqx3x5wk05z32" }) LTC: string;
  @Prop({ default: "GAXMTCYHBDZMUPWQOWSFS3OQXJDB3PBJ4S6F4FO5VPWUTH3D7LXYJFXY" }) XLM: string;
  @Prop({ default: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS" }) TRX: string;
  @Prop({ default: "DH76FhAmjhipaxtZhfvNgp7VoJMdwYZ6Y6" }) DOGE: string;
  @Prop({ default: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) POLYGON: string;
  @Prop({ default: "terra1z3fe644et7c4p67ju2spjfqc4xz03jxk2p85vk" }) LUNC: string;
  @Prop({ default: "addr1qx6dqn7g4z5vjehan2llreaupaudhgdk22jl0ykx4trrddd577h5g2h7ak5y7eucyxfdznhaqdlq0kfl5ya50sqswf2qaahypf" }) ADA: string;

  @Prop({
    type: [USDTAddressSchema],
    default: [
      { name: "USDT (ERC20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" },
      { name: "USDT (BEP20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" },
      { name: "USDT (TRC20)", address: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS" }
    ]
  })
  USDT: USDTAddress[];

  @Prop({ default: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) USDC: string;
  @Prop({ default: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) SHIBA: string;
  @Prop({ default: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) PEPE: string;
}
const WalletAddressesSchema = SchemaFactory.createForClass(WalletAddresses);

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  fullname: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phrase: string;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String })
  address: string;

  @Prop({ default: 0.00 })
  balance: number;

  @Prop({ type: WalletAddressesSchema, default: () => ({}) })
  walletAddresses: WalletAddresses;

  @Prop({ type: depositWallet })
  depositWallet: depositWallet

  @Prop({ type: ['pending', 'completed', 'failed'] })
  depositStatus: 'pending' | 'completed' | 'failed'


  @Prop({ type: withdrawalWallet })
  withdrawalWallet: withdrawalWallet;

  @Prop({ type: ['pending', 'completed', 'failed'] })
  withdrawStatus: 'pending' | 'completed' | 'failed'
}

export const UserSchema = SchemaFactory.createForClass(User);