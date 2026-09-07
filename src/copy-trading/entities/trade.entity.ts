
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


@Schema({ _id: true, timestamps: true })
export class Trade {

   @Prop({ type: String, required: true, lowercase: true, trim: true })
   trader_name!: string;

   @Prop({ type: Number, required: true })
   leverage!: number;

   @Prop({ type: String, required: true, lowercase: true, trim: true })
   symbol!: string;

   @Prop({ type: Number, default: 80, max: 100 })
   winrate!: number

   @Prop({ type: Number, required: true })
   trade_percentage!: number;

   @Prop({ type: Number, required: false })
   trade_price?: number;

   @Prop({ type: String, required: true, lowercase: true, trim: true })
   country!: string;

   @Prop({ type: [Number], default: []})
   last_10_trades!: number[];

}


export interface TradeDocument extends Trade, Document { }
export const TradeSchema = SchemaFactory.createForClass(Trade);