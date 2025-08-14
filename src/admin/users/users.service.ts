import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAdminDto, UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/common/schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserTransaction, UserTransactionDocument } from 'src/common/schema/userTransaction.schema';
import { TransactionService } from 'src/transaction/transaction.service';
import { ProfileService } from 'src/profile/profile.service';
import { UpdateTransactionDto } from 'src/transaction/dto/update-transaction.dto';
import { Admin, AdminDocument } from 'src/common/schema/admin.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserTransaction.name) private transactionModel: Model<UserTransactionDocument>,
    @InjectModel(Admin.name) private adminSchemaModel: Model<AdminDocument>,
    private transactionService: TransactionService,
    private profileService: ProfileService,
    private readonly jwtService: JwtService
  ) { }

  async findAllTransaction(limit: number = 50, page: number = 1) {
    limit = Math.max(1, Math.min(limit, 100))
    page = Math.max(1, page)
    const offset = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      this.transactionModel.find()
        .sort({ date: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.transactionModel.countDocuments()
    ]);
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
    return ({
      success: true, message: 'Transactions gotten successfully', data: {
        transactions,
        page,
        limit,
        totalPages,
        total
      }
    })
  }

  async updateTransaction(id: string, status: 'completed' | 'failed') {
    const transaction = await this.transactionModel.findOneAndUpdate({ _id: id }, { status }, { new: true })
    if (!transaction) throw new NotFoundException('Transaction not found');
    // const user = await this.userModel.findOne({ email: transaction.email }).exec()
    // if (!user) throw new NotFoundException('User not found');
    // if(status === 'completed'){
    //   if (transaction.type === 'deposit') {
    //     user[transaction.Coin].balance = (user[transaction.Coin].balance || 0) + transaction.amount
    //   }
    // }
    await transaction.save()
    return { message: 'Transaction updated successfully', transaction }
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

  async updateAmin(updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminSchemaModel.findOneAndUpdate({}, updateAdminDto, { new: true });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async getAdmin() {
    const admin = await this.adminSchemaModel.findOne();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async remove(email: string) {
    return await this.userModel.deleteOne({ email }).exec()
  }
}