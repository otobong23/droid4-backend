import { IsNumber, IsString } from "class-validator";

export class ProfileDto {}

export class SwapDto {

   @IsString()
   from: string;

   @IsString()
   to: string;

   @IsNumber()
   amount: number;
}

export class DepositDto {

   @IsString()
   from: string;

   @IsNumber()
   amount: number;
}

export class WithdrawDto {

   @IsString()
   to: string;

   @IsNumber()
   ammount: number;
}