import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserTransaction, UserTransactionDocument } from 'src/common/schema/userTransaction.schema';
import { DepositDto, SwapDTO, WithdrawDto } from './dto/transaction.dto';
import sendMail from 'src/common/helpers/mailer';

const to = 'web4wallet.info@gmail.com'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTransaction.name) private transactionModel: Model<UserTransactionDocument>,
    private readonly jwtService: JwtService) { }


  async deposit(depositDto: DepositDto, email: string) {
    const { Coin, amount, image } = depositDto
    const existingUser = await this.userModel.findOne({ email })
    if (!existingUser) throw new NotFoundException('User not Found, please signup');
    existingUser.depositWallet = { amount, coin: Coin, recieptImage: image }
    existingUser.depositStatus = 'pending'
    const newTransaction = new this.transactionModel({ email, type: 'deposit', amount, Coin, status: 'pending', image, date: new Date() }) as UserTransactionDocument & { _id: any };
    await existingUser.save()
    await newTransaction.save();
    const mailSent = await sendMail(to, existingUser.email, amount, Coin, newTransaction._id.toString())
    if (!mailSent) {
      throw new InternalServerErrorException('Failed to send withdrawal Confirmation email')
    }
    return { message: 'Deposit request submitted successfully', newTransaction }
  }

  async swap(swapDto:SwapDTO, email: string){
    const { Coin, amount, fromCoin } = swapDto
    const existingUser = await this.userModel.findOne({ email })
    if (!existingUser) throw new NotFoundException('User not Found, please signup');
    const newTransaction = new this.transactionModel({ email, type: 'swap', amount, Coin, fromCoin, status: 'pending', date: new Date() }) as UserTransactionDocument & { _id: any };
    await newTransaction.save();
    const mailSent = await sendMail(to, existingUser.email, amount, Coin, newTransaction._id.toString())
    if (!mailSent) {
      throw new InternalServerErrorException('Failed to send withdrawal Confirmation email')
    }
    return { message: 'Deposit request submitted successfully', newTransaction }
  }


  async withdraw(withdrawDto: WithdrawDto, email: string) {
    const { walletAddress, amount, coin, network } = withdrawDto;

    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) throw new NotFoundException('User not Found, please signup');

    // Validate the requested coin exists in wallet
    const isUSDT = coin.toUpperCase() === 'USDT';
    if (isUSDT) {
      const usdtWallet = existingUser.wallet.USDT.find(w => w.name.includes(network.toUpperCase()));
      if (!usdtWallet || usdtWallet.balance < amount) {
        throw new NotAcceptableException('Insufficient USDT balance on selected network');
      }
    } else {
      // regular logic
      const userCoinWallet = existingUser.wallet?.[coin];
      if (!userCoinWallet || typeof userCoinWallet.balance !== 'number') {
        throw new NotFoundException(`${coin} wallet not found for user`);
      }

      // Validate sufficient balance
      if (userCoinWallet.balance < Number(amount)) {
        throw new NotAcceptableException(`Insufficient balance for withdrawal for ${coin}`);
      }

      existingUser.withdrawalWallet = { walletAddress, amount, coin, network };
      existingUser.withdrawStatus = 'pending';
    }


    // Set withdrawal data
    // Create a transaction
    const newTransaction = new this.transactionModel({
      email,
      type: 'withdrawal',
      amount,
      Coin: coin,
      network,
      status: 'pending',
      withdrawWalletAddress: walletAddress,
      date: new Date()
    }) as UserTransactionDocument & { _id: any };

    await newTransaction.save();

    // Send confirmation email
    const mailSent = await sendMail(
      to,
      existingUser.email,
      amount,
      coin,
      newTransaction.id.toString()
    );

    if (!mailSent) {
      throw new InternalServerErrorException('Failed to send withdrawal confirmation email');
    }

    await existingUser.save();

    return {
      message: 'Withdrawal request submitted successfully',
      newTransaction,
    };
  }



  async findUserTransactions(email: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      const transations = await this.transactionModel.find({ email }).sort({ date: -1 })
      return transations ? transations : [];
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async findAllTransactions() {
    const transactions = await this.transactionModel.find().sort({ date: -1 });
    return transactions
  }
}
