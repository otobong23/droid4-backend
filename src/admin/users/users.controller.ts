import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { CopyTradingService } from 'src/copy-trading/copy-trading.service';
import { ActiveTradeDTO, CreateTradeDTO } from 'src/copy-trading/dto/create-copy-trading.dto';
import { ApiQuery } from '@nestjs/swagger';
import { UpdateTradeDTO } from 'src/copy-trading/dto/update-copy-trading.dto';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly copyTradingService: CopyTradingService,
  ) { }

  @Get()
  async getAdmin() {
    return await this.usersService.getAdmin()
  }

  @Patch()
  async updateAdmin(@Body() updateAdminDto: UpdateAdminDto) {
    return this.usersService.updateAmin(updateAdminDto);
  }

  @Get('transactions')
  async findAll(
    @Query('limit', ParseIntPipe) limit = 50,
    @Query('page', ParseIntPipe) page = 1
  ) {
    return await this.usersService.findAllTransaction(limit, page);
  }

  @Patch('transactions/:id')
  async updateTransaction(@Param('id') id: string, @Query('status') status: 'completed' | 'failed') {
    return await this.usersService.updateTransaction(id, status)
  }

  @Get('users')
  async findAllUsers(
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('page', ParseIntPipe) page = 1
  ) {
    return await this.usersService.findAllUser(limit, page)
  }

  @Get('user')
  async findUserById(@Query('id') id: string) {
    return await this.usersService.findUserById(id)
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



  @Post('create-trade')
  createTrade(@Body() body: CreateTradeDTO) {
    return this.copyTradingService.createTrade(body)
  }


  @ApiQuery({
    name: 'tradeId',
    required: true,
    type: String,
    description: 'tradeId of the trade to be updated'
  })
  @Patch('update-trade')
  updateTrade(@Query('tradeId') tradeId: string, @Body() body: UpdateTradeDTO) {
    return this.copyTradingService.updateTrade(tradeId, body);
  }

  @ApiQuery({
    name: 'tradeId',
    required: true,
    type: String,
    description: 'tradeId of the trade to be deleted'
  })
  @Delete('delete-trade')
  deleteTrade(@Query('tradeId') tradeId: string) {
    return this.copyTradingService.deleteTrade(tradeId);
  }

  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    description: 'Email of the user whose active trades are to be updated'
  })
  @ApiQuery({
    name: 'tradeId',
    required: true,
    type: String,
    description: 'tradeId of the trade to be updated'
  })
  @Patch('update-user-active-trades')
  updateUserActiveTrades(@Query('email') email: string, @Query('tradeId') tradeId: string, @Body() body: ActiveTradeDTO) {
    return this.copyTradingService.updateUserActiveTrades(email, body, tradeId);
  }
}
