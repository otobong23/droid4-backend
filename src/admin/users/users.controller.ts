import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  async getAdmin(){
    return await this.usersService.getAdmin()
  }

  @Patch()
  async updateAdmin(@Body() updateAdminDto: UpdateAdminDto) {
    return this.usersService.updateAmin(updateAdminDto);
  }

  @Get('transactions')
  async findAll() {
    return await this.usersService.findAllTransaction();
  }

  @Patch('transactions/:id')
  async updateTransaction(@Param('id') id: string, @Query('status') status: 'completed' | 'failed') {
    return await this.usersService.updateTransaction(id, status)
  }

  @Get('users')
  async findAllUsers() {
    return await this.usersService.findAllUser()
  }

  @Get('users/:email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch('users/:email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @Delete('users/:email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }
}
