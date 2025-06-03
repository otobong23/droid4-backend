import { IsString } from "class-validator";

export class SendDTO {
    @IsString()
    amount: number
    withdrawalWallet: string
}

export class RecieveDTO {
    @IsString()
    depositWallet: string
}
