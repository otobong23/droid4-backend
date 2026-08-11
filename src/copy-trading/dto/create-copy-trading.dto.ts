import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCopyTradingDto { }


export class CreateTradeDTO {

   @ApiProperty({
      example: 'Miracle',
      type: String,
      description: "Trader's name",
   })
   @IsString()
   @IsNotEmpty()
   trader_name!: string;


   @ApiProperty({
      example: 50,
      type: Number,
      description: "Trade's Leverage",
   })
   @IsNumber()
   @IsNotEmpty()
   leverage!: number;


   @ApiProperty({
      example: 'btc/usdt',
      type: String,
      description: "Trade's symbol",
   })
   @IsString()
   @IsNotEmpty()
   symbol!: string;


   @ApiProperty({
      example: 70,
      type: Number,
      description: "Trader's Winrate",
   })
   @IsNumber()
   @IsOptional()
   winrate!: number


   @ApiProperty({
      example: 500,
      type: Number,
      description: "Trade's Price",
   })
   @IsNumber()
   @IsNotEmpty()
   trade_percentage!: number;


   @ApiProperty({
      example: 'country name',
      type: String,
      description: "Trade's country",
   })
   @IsString()
   @IsNotEmpty()
   country!: string;

   @ApiProperty({
      example: [2, -1, 3, 4, -3, 5, -2, 1, 3, -2],
      type: [Number],
      description: "Last 10 trades of the trader, where positive numbers represent wins and negative numbers represent losses"
   })
   @IsNumber({}, { each: true })
   last_10_trades!: number[];

}


export class ActiveTradeDTO {

   @ApiProperty({
      example: 'Miracle',
      type: String,
      description: "Trader's Name",
   })
   @IsString()
   trader_name!: string;


   @ApiProperty({
      example: 50,
      type: Number,
      description: "Trade's Leverage",
   })
   @IsNumber()
   leverage!: number;


   @ApiProperty({
      example: 'btc/usdt',
      type: String,
      description: "Trade's symbol",
   })
   @IsString()
   symbol!: string;


   @ApiProperty({
      example: 70,
      type: Number,
      description: "Trader's Winrate",
   })
   @IsNumber()
   winrate!: number


   @ApiProperty({
      example: 500,
      type: Number,
      description: "Trade's PNL",
   })
   @IsNumber()
   PNL?: number;


   @ApiProperty({
      example: 'country name',
      type: String,
      description: "Trade's country",
   })
   @IsString()
   country!: string;
}


export class tradeIdDto {

   @ApiProperty({
      example: 'tradeId123',
      name: 'tradeId',
      type: String,
      description: "Trade's ID",
   })
   @IsString()
   tradeId!: string;

}

export class copyTradeWithdrawDto {

   @ApiProperty({
      example: 500,
      name: 'amount',
      type: Number,
      description: "Withdrawal amount",
   })
   @IsNumber()
   amount!: number;

}

export class copyTradeDepositDto {

   @ApiProperty({
      example: 500,
      name: 'amount',
      type: Number,
      description: "Deposit amount",
   })
   @IsNumber()
   amount!: number;

}