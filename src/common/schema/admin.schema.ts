import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class USDTAddress {
   @Prop() name: string;
   @Prop() address: string;
}
export const USDTAddressSchema = SchemaFactory.createForClass(USDTAddress);

@Schema({ _id: false })
class Addresses {
   @Prop({ type: String, default: 'bc1q2v4cjsmeg05shfk28stvc74dy8cfa2k2j32hlp' }) BTC: string;
   @Prop({ type: String, default: '0x464B0007a2A4C29912f0fb3EB8A15831961890CF' }) ETH: string;
   @Prop({ type: String, default: '9PwLjinV7riyVhe4PjseZBJw2y7wt8uoWa1wqTyX8pfV' }) SOL: string;
   @Prop({ type: String, default: '0x464B0007a2A4C29912f0fb3EB8A15831961890CF' }) BNB: string;
   @Prop({ type: String, default: 'rLNwyfNs8YwapeBRJhj5igj3NRMZGiNufQ' }) XRP: string;
   @Prop({ type: String, default: 'ltc1q6qxqkk9ztf46r8z4504s4v8dzrqx3x5wk05z32' }) LTC: string;
   @Prop({ type: String, default: 'GAXMTCYHBDZMUPWQOWSFS3OQXJDB3PBJ4S6F4FO5VPWUTH3D7LXYJFXY' }) XLM: string;
   @Prop({ type: String, default: 'TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS' }) TRX: string;
   @Prop({ type: String, default: 'DH76FhAmjhipaxtZhfvNgp7VoJMdwYZ6Y6' }) DOGE: string;
   @Prop({ type: String, default: '0x464B0007a2A4C29912f0fb3EB8A15831961890CF' }) POLYGON: string;
   @Prop({ type: String, default: 'terra1z3fe644et7c4p67ju2spjfqc4xz03jxk2p85vk' }) LUNC: string;
   @Prop({ type: String, default: 'addr1qx6dqn7g4z5vjehan2llreaupaudhgdk22jl0ykx4trrddd577h5g2h7ak5y7eucyxfdznhaqdlq0kfl5ya50sqswf2qaahypf' }) ADA: string;
   @Prop({
      type: [USDTAddressSchema],
      default: [
         { name: "USDT (ERC20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" },
         { name: "USDT (BEP20)", address: "0x464B0007a2A4C29912f0fb3EB8A15831961890CF" },
         { name: "USDT (TRC20)", address: "TSrUZySdmHRzRnAFPHpaFPHZtbqmDvbJeS" }
      ]
   })
   USDT: USDTAddress[];
   @Prop({ type: String, default: '0x464B0007a2A4C29912f0fb3EB8A15831961890CF' }) USDC: string;
   @Prop({ type: String, default: '0x464B0007a2A4C29912f0fb3EB8A15831961890CF' }) SHIBA: string;
   @Prop({ type: String, default: '0x464B0007a2A4C29912f0fb3EB8A15831961890CF' }) PEPE: string;
}
const AddressesSchema = SchemaFactory.createForClass(Addresses);

const USER_PASS = '12345678'

@Schema({ timestamps: true })
export class Admin {
   @Prop({ type: String, required: true, unique: true })
   email: string;

   @Prop({ type: String, required: true, default: USER_PASS })
   password: string;

   @Prop({ type: Number, default: 0 })
   minDepositAmount: number;

   @Prop({ type: Number, default: 100000 })
   maxDepositAmount: number;

   @Prop({ type: Number, default: 0 })
   minWithdrawalAmount: number;

   @Prop({ type: Number, default: 1000 })
   maxWithdrawalAmount: number;

   @Prop({ type: AddressesSchema, default: () => ({}) })
   addresses: Addresses;
}

export interface AdminDocument extends Admin, Document { }
export const AdminSchema = SchemaFactory.createForClass(Admin);