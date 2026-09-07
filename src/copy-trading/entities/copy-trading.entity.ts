import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/common/schema/user.schema';


@Schema({ _id: false })
class ActiveTrade {
   @Prop({ type: String, required: true })
   tradeId!: string;

   @Prop({ type: String, required: true, lowercase: true, trim: true })
   trader_name!: string;

   @Prop({ type: Number, required: true })
   leverage!: number;

   @Prop({ type: String, required: true, lowercase: true, trim: true })
   symbol!: string;

   @Prop({ type: Number, default: 80, max: 100 })
   winrate!: number

   @Prop({ type: Number, default: 0 })
   trade_percentage!: number;

   @Prop({ type: Number, default: 0 })
   PNL?: number;

   @Prop({ type: String, required: true, lowercase: true, trim: true })
   country!: string;
}


@Schema({ _id: true })
export class CopyTrading {

   @Prop({ type: String,  ref: User.name, required: true, unique: true })
   email!: string;

   @Prop({ type: Number, default: 0 })
   balance!: number;

   @Prop({ type: [ActiveTrade], default: []})
   active_trades!: ActiveTrade[];
}

export interface CopyTradingDocument extends CopyTrading, Document { }
export const CopyTradingSchema = SchemaFactory.createForClass(CopyTrading);