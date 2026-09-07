import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTradeDTO } from './dto/create-copy-trading.dto';
import {
  UpdateActiveTradeDTO,
  UpdateTradeDTO,
} from './dto/update-copy-trading.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Model } from 'mongoose';
import {
  UserTransaction,
  UserTransactionDocument,
} from 'src/common/schema/userTransaction.schema';
import {
  CopyTrading,
  CopyTradingDocument,
} from './entities/copy-trading.entity';
import { Trade, TradeDocument } from './entities/trade.entity';

@Injectable()
export class CopyTradingService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTransaction.name)
    private transactionModel: Model<UserTransactionDocument>,
    @InjectModel(CopyTrading.name)
    private copyTradingModel: Model<CopyTradingDocument>,
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
  ) {}

  async getUserTradingDetails(email: string) {
    const existingCopyTrader = await this.copyTradingModel.findOne({ email });
    return existingCopyTrader;
  }

  async deposit(email: string, amount: number) {
    const existingCopyTrader = await this.copyTradingModel.findOne({ email });
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) throw new NotFoundException('User not found');
    if (!existingCopyTrader) throw new NotFoundException('User not found');

    const balance = (existingUser.wallet?.USDT || []).reduce(
      (acc, curr) => acc + (curr.balance || 0),
      0,
    );
    if (balance < amount) throw new ConflictException('Insufficient balance');

    existingCopyTrader.balance += amount;

    // Deduct amount from user's USDT wallet (across available networks)
    let remaining = amount;
    if (existingUser.wallet?.USDT) {
      for (const item of existingUser.wallet.USDT) {
        if (remaining <= 0) break;
        const take = Math.min(item.balance || 0, remaining);
        item.balance -= take;
        remaining -= take;
      }
      if (remaining > 0 && existingUser.wallet.USDT.length > 0) {
        existingUser.wallet.USDT[0].balance -= remaining;
      }
    }

    existingUser.markModified('wallet');
    existingCopyTrader.markModified('balance');

    await existingCopyTrader.save();
    await existingUser.save();

    const transaction = await this.transactionModel.create({
      email,
      type: 'deposit',
      amount,
      note: `Internal transfer: Deposit to copy trading account`,
      status: 'completed',
    });

    return transaction;
  }

  async withdraw(email: string, amount: number) {
    const existingCopyTrader = await this.copyTradingModel.findOne({ email });
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) throw new NotFoundException('User not found');
    if (!existingCopyTrader) throw new NotFoundException('User not found');

    if (existingCopyTrader.balance < amount)
      throw new ConflictException('Insufficient balance');
    existingCopyTrader.balance -= amount;

    // No fee charged on withdrawal - 100% credited to user's wallet
    if (existingUser.wallet?.USDT && existingUser.wallet.USDT.length > 0) {
      const targetIndex = existingUser.wallet.USDT.length > 2 ? 2 : 0;
      existingUser.wallet.USDT[targetIndex].balance += amount;
    }

    existingUser.markModified('wallet');
    existingCopyTrader.markModified('balance');

    await existingCopyTrader.save();
    await existingUser.save();

    const transaction = await this.transactionModel.create({
      email,
      type: 'withdrawal',
      amount,
      note: `Internal transfer: Withdraw from copy trading account`,
      status: 'completed',
    });

    return transaction;
  }

  async copyTrade(email: string, tradeId: string) {
    const existingCopyTrader = await this.copyTradingModel.findOne({ email });
    if (!existingCopyTrader) throw new NotFoundException('User not found');

    const trade = await this.tradeModel.findOne({ _id: tradeId });
    if (!trade) throw new NotFoundException('Trade not found');

    // Require a funded copy-trading wallet to participate
    if (existingCopyTrader.balance <= 0) {
      throw new ConflictException(
        'Insufficient balance in copy trading wallet',
      );
    }

    // trade_percentage is purely a profit-commission rate — no upfront deduction
    const profitCommissionRate = Number(
      trade.trade_percentage ?? trade.trade_price ?? 0,
    );

    existingCopyTrader.active_trades.push({
      tradeId,
      trader_name: trade.trader_name,
      leverage: trade.leverage,
      symbol: trade.symbol,
      winrate: trade.winrate,
      country: trade.country,
      trade_percentage: profitCommissionRate,
      // PNL starts at 0 — the admin sets this when settling/liquidating the trade
    });

    await existingCopyTrader.save();

    // Record a zero-cost entry so the activity log stays consistent
    await this.transactionModel.create({
      email,
      type: 'buy',
      amount: 0,
      note: `Copy trade opened: ${trade.symbol} | commission rate: ${profitCommissionRate}%`,
      status: 'completed',
    });

    return existingCopyTrader;
  }

  async liquidate(email: string, tradeId: string) {
    const existingCopyTrader = await this.copyTradingModel.findOne({ email });
    if (!existingCopyTrader) throw new NotFoundException('User not found');

    const activeIndex = existingCopyTrader.active_trades.findIndex(
      (trade) => trade.tradeId === tradeId,
    );
    if (activeIndex === -1)
      throw new NotFoundException('Active trade not found');

    const activeTrade = existingCopyTrader.active_trades[activeIndex];
    existingCopyTrader.balance += activeTrade.PNL!;
    existingCopyTrader.active_trades.splice(activeIndex, 1);
    await existingCopyTrader.save();

    await this.transactionModel.create({
      email,
      type: 'sell',
      amount: activeTrade.PNL!,
      note: `Internal transfer: copy trade ${activeTrade.symbol}`,
      status: 'completed',
    });
    return existingCopyTrader;
  }

  async allTrades(limit: number = 50, page: number = 1) {
    limit = Math.max(1, Math.min(limit, 100));
    page = Math.max(1, page);
    const offset = (page - 1) * limit;
    const [trades, total] = await Promise.all([
      this.tradeModel.find().limit(limit).skip(offset),
      this.tradeModel.countDocuments(),
    ]);
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);

    return {
      trades,
      page,
      limit,
      totalPages,
      total,
    };
  }

  // Admin functions to manage trades and user active trades
  async updateUserActiveTrades(
    email: string,
    activeTradesDto: UpdateActiveTradeDTO,
    tradeId: string,
  ) {
    const existingCopyTrader = await this.copyTradingModel.findOne({ email });
    if (!existingCopyTrader) throw new NotFoundException('User not found');

    const trade = existingCopyTrader.active_trades.find(
      (t) => t.tradeId === tradeId,
    );
    if (!trade) throw new NotFoundException('Trade not found for this user');

    Object.assign(trade, activeTradesDto);

    existingCopyTrader.markModified('active_trades');
    await existingCopyTrader.save();
    return existingCopyTrader;
  }

  // create a trade from the admin panel
  async createTrade(tradeDto: CreateTradeDTO) {
    const trade = await this.tradeModel.create(tradeDto);
    return trade;
  }

  async updateTrade(tradeId: string, tradeDto: UpdateTradeDTO) {
    const trade = await this.tradeModel.findByIdAndUpdate(tradeId, tradeDto, {
      new: true,
    });
    if (!trade) throw new NotFoundException('Trade not found');
    return trade;
  }

  async deleteTrade(tradeId: string) {
    const trade = await this.tradeModel.findByIdAndDelete(tradeId);
    if (!trade) throw new NotFoundException('Trade not found');
    return trade;
  }
}
