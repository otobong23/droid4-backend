import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { DepositDto, WithdrawDto } from './dto/transaction.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer'

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('send') //to withdraw
  send(@Body() withdrawDto: WithdrawDto, @Req() req) {
    const email = req.user.email
    return this.transactionService.withdraw(withdrawDto, email);
  }

  @UseInterceptors(FileInterceptor('image', {
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        return cb(new BadRequestException('Only image files allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
  }))
  @Post('recieve') // to deposit
  recieve(@Body() depositDto:DepositDto, @UploadedFile() image: Multer.File, @Req() req) {
    const email = req.user.email
    return this.transactionService.deposit(depositDto, email, image);
  }

  @Get('histroy')
  findAll(@Req() req){
    const email = req.user.email
    return this.transactionService.findUserTransactions(email);
  }
}
