import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class DepositDto {

   @IsNotEmpty()
   @IsString()
   coin: string;

   @IsNotEmpty()
   @IsString()
   amount: string;
}

export class WithdrawDto {

   @IsNotEmpty()
   @IsString()
   walletAddress: string;

   @IsNotEmpty()
   @IsNumber()
   amount: number;

   @IsNotEmpty()
   @IsString()
   coin: string;

   @IsNotEmpty()
   @IsString()
   network: string;
}