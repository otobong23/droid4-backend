// src/seed/dto/validate-seed.dto.ts
import { IsEmail, IsString } from 'class-validator';

export class ValidateSeedDto {
  @IsEmail()
  email: string;

  @IsString()
  phrase: string;
}
