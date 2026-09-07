import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CopyTradingService } from './copy-trading.service';
import {
  copyTradeDepositDto,
  copyTradeWithdrawDto,
  CreateCopyTradingDto,
  tradeIdDto,
} from './dto/create-copy-trading.dto';
import { UpdateCopyTradingDto } from './dto/update-copy-trading.dto';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { ApiProperty, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('copy-trading')
export class CopyTradingController {
  constructor(private readonly copyTradingService: CopyTradingService) {}

  @Get('user-trading-details')
  @ApiProperty({
    type: undefined,
    description: 'No body required',
  })
  async getUserTradingDetails(@Req() req) {
    const email = req.user.email;
    return this.copyTradingService.getUserTradingDetails(email);
  }

  @Post('deposit')
  async deposit(@Req() req, @Body() body: copyTradeDepositDto) {
    const email = req.user.email;
    return this.copyTradingService.deposit(email, body.amount);
  }

  @Post('withdraw')
  async withdraw(@Req() req, @Body() body: copyTradeWithdrawDto) {
    const email = req.user.email;
    return this.copyTradingService.withdraw(email, body.amount);
  }

  @Post('copy-trade')
  async copyTrade(@Req() req, @Body() body: tradeIdDto) {
    const email = req.user.email;
    return this.copyTradingService.copyTrade(email, body.tradeId);
  }

  @Post('liquidate')
  async liquidate(@Req() req, @Body() body: tradeIdDto) {
    const email = req.user.email;
    return this.copyTradingService.liquidate(email, body.tradeId);
  }

  @Get('all-trades')
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of trades to return (default: 50)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
  })
  async allTrades(
    @Query('limit', ParseIntPipe) limit = 50,
    @Query('page', ParseIntPipe) page = 1,
  ) {
    return this.copyTradingService.allTrades(limit, page);
  }
}
