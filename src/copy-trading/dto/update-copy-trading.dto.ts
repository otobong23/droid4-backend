import { PartialType } from '@nestjs/mapped-types';
import { CreateCopyTradingDto, CreateTradeDTO } from './create-copy-trading.dto';

export class UpdateCopyTradingDto extends PartialType(CreateCopyTradingDto) {}

export class UpdateTradeDTO extends PartialType(CreateTradeDTO) {}