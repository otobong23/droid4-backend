import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserTransaction, UserTransactionDocument } from 'src/common/schema/userTransaction.schema';
import { TransactionService } from 'src/transaction/transaction.service';
import { ProfileService } from 'src/profile/profile.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTransaction.name) private transactionModel: Model<UserTransactionDocument>,
    private transactionService: TransactionService,
    private profileService: ProfileService,
    private readonly jwtService: JwtService
  ) { }

  async findAllTransaction() {
    return await this.transactionService.findAllTransactions()
  }
  async findAllUser() {
    return await this.profileService.findAllUsers()
  }

  async findOne(email: string) {
    return await this.profileService.getUserProfile({ email })
  }

  async update(email: string, updateUserDto: UpdateUserDto) {
    let updateData: any = { ...updateUserDto };
    if (updateUserDto.walletAddresses) {
      updateData.walletAddresses = {
        ...Object.fromEntries(
          Object.entries(updateUserDto.walletAddresses).map(([k, v]) => [k, v ?? ''])
        )
      };
    }
    return await this.profileService.updateUser(email, updateData);
  }

  async remove(email: string) {
    return await this.userModel.deleteOne({ email }).exec()
  }
}
