import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";


export class Login {
   @IsNotEmpty()@IsString()@IsEmail()
   readonly email: string;

   @IsNotEmpty()@IsString()@Length(6)
   readonly password: string;
}
