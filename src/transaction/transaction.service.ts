import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserTransaction, UserTransactionDocument } from 'src/common/schema/userTransaction.schema';
import { DepositDto, WithdrawDto } from './dto/transaction.dto';
import sendMail from 'src/common/helpers/mailer';
import { Multer } from 'multer'

const to = 'godianofficiall@gmail.com'

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTransaction.name) private transactionModel: Model<UserTransactionDocument>,
    private readonly jwtService: JwtService) { }

  async deposit(depositDto: DepositDto, email: string, image: Multer.File) {
    const { coin, amount } = depositDto
    if (!image) {
      throw new BadRequestException('Receipt image is required');
    }
    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      const newTransaction = new this.transactionModel({ email, type: 'deposit', amount, coin, status: 'pending', date: new Date() }) as UserTransactionDocument & { _id: any };
      await newTransaction.save();
      const recieptImage = image.buffer.toString('base64');
      existingUser.depositWallet = { amount, coin, recieptImage }
      existingUser.depositStatus = 'pending'

      const mailSent = await sendMail(to, existingUser.email, amount, coin, newTransaction._id.toString())
      if (!mailSent) {
        throw new InternalServerErrorException('Failed to send withdrawal Confirmation email')
      }

      await existingUser.save();
      return { message: 'Deposit request submitted successfully', newTransaction }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }
  async withdraw(withdrawDto: WithdrawDto, email: string) {
    const { walletAddress, amount, coin, network } = withdrawDto;
    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      existingUser.withdrawalWallet = { walletAddress, amount, coin, network }
      existingUser.withdrawStatus = 'pending';
      if (existingUser.balance < amount) {
        throw new InternalServerErrorException('Insufficient balance for withdrawal')
      }

      const newTransaction = new this.transactionModel({ email, type: 'withdrawal', amount, coin, network, status: 'pending', date: new Date() }) as UserTransactionDocument & { _id: any };
      await newTransaction.save();
      const mailSent = await sendMail(to, existingUser.email, amount, coin, newTransaction._id.toString())
      if (!mailSent) {
        throw new InternalServerErrorException('Failed to send withdrawal Confirmation email')
      }

      await existingUser.save();
      return { message: 'Withdrawal request submitted successfully', newTransaction }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }


  async findAll(email: string) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      const transations = await this.transactionModel.find({ email }).sort({ date: -1})
      return transations ? transations : [];
    }else {
      throw new NotFoundException('User not Found, please signup')
    }
  }
}
