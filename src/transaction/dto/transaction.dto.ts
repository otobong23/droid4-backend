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
   @IsString()
   amount: string;

   @IsNotEmpty()
   @IsString()
   coin: string;

   @IsNotEmpty()
   @IsString()
   network: string;
}