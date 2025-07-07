import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { DepositDto, WithdrawDto } from './dto/transaction.dto';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('send') //to withdraw
  send(@Body() withdrawDto: WithdrawDto, @Req() req) {
    const email = req.user.email
    return this.transactionService.withdraw(withdrawDto, email);
  }

  @Post('recieve') // to deposit
  recieve(@Body() depositDto:DepositDto, @Req() req) {
    const email = req.user.email
    return this.transactionService.deposit(depositDto, email);
  }

  @Get('history')
  findAll(@Req() req){
    const email = req.user.email
    return this.transactionService.findUserTransactions(email);
  }
}
