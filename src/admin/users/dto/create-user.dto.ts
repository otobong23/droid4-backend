import { Type } from 'class-transformer';
import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean, ValidateNested, IsEnum } from 'class-validator';


export class DepositWalletDto {
   @IsNumber()
   amount: number;

   @IsString()
   coin: string;

   @IsString()
   recieptImage: string;
}

export class WithdrawalWalletDto {
   @IsString()
   walletAddress: string;

   @IsNumber()
   amount: number;

   @IsString()
   coin: string;

   @IsString()
   network: string;
}

export class USDTAddressDto {
   @IsString()
   name: string;

   @IsString()
   address: string;
}

export class WalletAddressesDto {
   @IsOptional()
   @IsString()
   BTC?: string;

   @IsOptional()
   @IsString()
   ETH?: string;

   @IsOptional()
   @IsString()
   SOL?: string;

   @IsOptional()
   @IsString()
   BNB?: string;

   @IsOptional()
   @IsString()
   XRP?: string;

   @IsOptional()
   @IsString()
   LTC?: string;

   @IsOptional()
   @IsString()
   XLM?: string;

   @IsOptional()
   @IsString()
   TRX?: string;

   @IsOptional()
   @IsString()
   DOGE?: string;

   @IsOptional()
   @IsString()
   POLYGON?: string;

   @IsOptional()
   @IsString()
   LUNC?: string;

   @IsOptional()
   @IsString()
   ADA?: string;

   @IsOptional()
   @ValidateNested({ each: true })
   @Type(() => USDTAddressDto)
   USDT?: USDTAddressDto[];

   @IsOptional()
   @IsString()
   USDC?: string;

   @IsOptional()
   @IsString()
   SHIBA?: string;

   @IsOptional()
   @IsString()
   PEPE?: string;
}


export class CreateUserDto {
   @IsString()
   fullname: string;

   @IsEmail()
   email: string;

   @IsString()
   phrase: string;

   @IsOptional()
   @IsString()
   country?: string;

   @IsOptional()
   @IsString()
   phone?: string;

   @IsOptional()
   @IsString()
   address?: string;

   @IsOptional()
   @IsNumber()
   balance?: number;

   @IsOptional()
   @ValidateNested()
   @Type(() => WalletAddressesDto)
   walletAddresses?: WalletAddressesDto;

   @IsOptional()
   @ValidateNested()
   @Type(() => DepositWalletDto)
   depositWallet?: DepositWalletDto;

   @IsOptional()
   @IsEnum(['pending', 'completed', 'failed'])
   depositStatus?: 'pending' | 'completed' | 'failed';

   @IsOptional()
   @ValidateNested()
   @Type(() => WithdrawalWalletDto)
   withdrawalWallet?: WithdrawalWalletDto; // Create a separate WithdrawalWalletDto if needed

   @IsOptional()
   @IsEnum(['pending', 'completed', 'failed'])
   withdrawStatus?: 'pending' | 'completed' | 'failed';

   @IsOptional()
   @IsBoolean()
   isVerified?: boolean;

   @IsOptional()
   @IsBoolean()
   ActivateBot?: boolean;

   @IsOptional()
   joinDate?: Date;
}

export class AdminDto {
   @IsString()
   @IsOptional()
   password: string;

   @IsNumber()
   @IsOptional()
   minDepositAmount: number

   @IsNumber()
   @IsOptional()
   maxDepositAmount: number

   @IsNumber()
   @IsOptional()
   minWithdrawalAmount: number

   @IsNumber()
   @IsOptional()
   maxWithdrawalAmount: number

   @IsOptional()
   @ValidateNested()
   @Type(() => WalletAddressesDto)
   addresses: WalletAddressesDto
}