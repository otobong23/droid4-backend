import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ProfileDto {}

export class SwapDto {

   @IsString()
   from: string;

   @IsString()
   to: string;

   @IsNumber()
   amount: number;
}

