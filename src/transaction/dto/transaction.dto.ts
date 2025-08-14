import { Type } from "class-transformer";
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";


export class DepositDto {

   @IsNotEmpty()
   @IsString()
   Coin: string;

   @IsNotEmpty()
   @IsNumber()
   amount: number;

   @IsNotEmpty()
   @IsString()
   image: string
}

export class WithdrawDto {

   @IsNotEmpty()
   @IsString()
   walletAddress: string;

   @IsNotEmpty()
   @IsString()
   amount: number;

   @IsNotEmpty()
   @IsString()
   coin: string;

   @IsNotEmpty()
   @IsString()
   network: string;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PLANS = 'plans',
  YIELD = 'yield',
  SWAP = 'swap',
  BUY = 'buy',
  SELL = 'sell'
}

export enum TransactionStatus {
  PENDING   = 'pending',
  COMPLETED = 'completed',
  FAILED    = 'failed',
}

export class SwapDTO {
  @IsString()
  Coin: string;

  @IsString()
  fromCoin: string;

  @Type(() => Number)          // converts "1.23" (string) → 1.23 (number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  amount!: number;
}

export class CreateTransactionDto {
  /* ── Required ─────────────────────────────────────────── */
  @IsEmail()
  email!: string;

  @IsEnum(TransactionType)
  type!: TransactionType;

  @Type(() => Number)          // converts "1.23" (string) → 1.23 (number)
  @IsNumber({ maxDecimalPlaces: 8 })
  @IsPositive()
  amount!: number;

  @IsString()
  coin!: string;               // keep the capital ‘C’ if you must: @Expose({ name: 'Coin' })
  
  /* ── Optional ─────────────────────────────────────────── */
  @IsOptional()
  @IsString()
  fromCoin?: string | null;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status: TransactionStatus = TransactionStatus.PENDING;

  @IsOptional()
  @IsString()
  network?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  note?: string;

  @IsOptional()
  @IsString()                  // switch to IsUrl() if you store URLs
  image?: string;

  @IsOptional()
  @IsString()
  withdrawWalletAddress?: string;

  @IsOptional()
  @IsDateString()              // ISO‑8601 string → Date automatically by class‑transformer
  date?: Date;
}