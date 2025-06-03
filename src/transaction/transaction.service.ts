import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { RecieveDTO, SendDTO } from './dto/create-transaction.dto';
import { UserTransaction, UserTransactionDocument } from 'src/common/schema/userTransaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>, 
    @InjectModel(UserTransaction.name) private transactionModel: Model<UserTransactionDocument>, 
    private readonly jwtService: JwtService) { }

  async send(send_dto: SendDTO, email) {
    const { withdrawalWallet } = send_dto
    const existingUser = await this.userModel.findOne(email)
    if (!existingUser) {
      throw new NotFoundException('user Not Found')
    }
    existingUser.withdrawStatus = "pending" // only admin can change from pending to completed | failed
    existingUser.withdrawalWallet = withdrawalWallet

    const newTransaction = new this.transactionModel({
      email, type: 'withdrawal',
    })
    await existingUser.save()

    //sending info to admin start
    //sending info to admin end

    return '';
  }

  recieve(recieve_dto: RecieveDTO, email) {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }


  findAll() {
    return '';
  }
}
