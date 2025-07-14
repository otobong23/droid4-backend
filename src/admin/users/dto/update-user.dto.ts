import { PartialType } from '@nestjs/mapped-types';
import { AdminDto, CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateAdminDto extends PartialType(AdminDto) {}