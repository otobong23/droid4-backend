import { PartialType } from '@nestjs/mapped-types';
import { ActiveTradeDTO, CreateCopyTradingDto, CreateTradeDTO } from './create-copy-trading.dto';

export class UpdateCopyTradingDto extends PartialType(CreateCopyTradingDto) {}

export class UpdateTradeDTO extends PartialType(CreateTradeDTO) {}

export class UpdateActiveTradeDTO extends PartialType(ActiveTradeDTO) {}