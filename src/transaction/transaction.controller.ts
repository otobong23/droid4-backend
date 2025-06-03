import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { SendDTO, RecieveDTO } from './dto/create-transaction.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('send') //to withdraw
  send(@Body() send_dto: SendDTO, @Req() req) {
    const email = req.user.email
    return this.transactionService.send(send_dto, email);
  }

  @Post('recieve') // to recieve
  recieve(@Body() recieve_dto:RecieveDTO, @Req() req) {
    const email = req.user.email
    return this.transactionService.recieve(recieve_dto, email);
  }

  @Get('histroy')
  findAll(@Req() req){
    const email = req.user.email
    return this.transactionService.findAll
  }

  @Get('history:id')
  findOne(@Param('id') id: string, @Req() req) {
    const email = req.user.email
    return this.transactionService.findOne(+id);
  }
}
