import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}