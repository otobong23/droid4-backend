import { PartialType } from '@nestjs/mapped-types';
import { ValidateSeedDto } from './validate-seed.dto';

export class UpdateSeedDto extends PartialType(ValidateSeedDto) {}
