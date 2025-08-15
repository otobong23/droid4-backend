import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Admin, AdminDocument } from 'src/common/schema/admin.schema';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Admin.name) private adminSchemaModel: Model<AdminDocument>,
    private readonly jwtService: JwtService
  ) {
  }

  async getUserProfile({ email }: { email: string }) {
    const existingUser = await this.userModel.findOne({ email })
    const existingAdmin = await this.adminSchemaModel.findOne()
    if (!existingUser) throw new NotFoundException('User not Found, please signup');

    if (existingAdmin && existingAdmin.addresses) {
      const adminAddresses = existingAdmin.addresses;

      // List of coins to update (excluding USDT)
      const coins = [
        "BTC", "ETH", "SOL", "BNB", "XRP", "LTC", "XLM", "TRX",
        "DOGE", "POLYGON", "LUNC", "ADA", "USDC", "SHIBA", "PEPE"
      ];

      // Update each coin's address in the user's wallet
      coins.forEach((coin) => {
        if (existingUser.wallet && existingUser.wallet[coin] && adminAddresses[coin]) {
          existingUser.wallet[coin].address = adminAddresses[coin];
        }
      });

      // Update USDT addresses (match by name)
      if (Array.isArray(existingUser.wallet.USDT) && Array.isArray(adminAddresses.USDT)) {
        existingUser.wallet.USDT.forEach((userUsdt: any) => {
          const adminUsdt = adminAddresses.USDT.find((a: any) => a.name === userUsdt.name);
          if (adminUsdt) {
            userUsdt.address = adminUsdt.address;
          }
        });
      }
    }
    return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
  }

  async updateUser(email: string, updateData: Partial<User>) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, updateData, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateUserFullname(email: string, fullname: string) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { fullname }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateUserCountry(email: string, country: string) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { country }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateUserPhone(email: string, phone: string) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { phone }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateUserAddress(email: string, address: string) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { address }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateVerification(email: string, verificationStatus: 'pending' | 'verified') {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { verificationStatus }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateKYC(email: string, KYC: string) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { KYC, KYCVerificationStatus: 'pending' }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateKYCVerified(email: string, KYCVerified: boolean) {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { KYCVerified }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async updateKYCVerificationStatus(email: string, KYCVerificationStatus: 'verified' | 'pending' | 'unverified') {
    const existingUser = await this.userModel.findOneAndUpdate({ email }, { KYCVerificationStatus }, { new: true })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
  }

  async findAllUsers(limit: number = 10, page: number = 1) {
    limit = Math.max(1, Math.min(limit, 100))
    page = Math.max(1, page)
    const offset = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userModel.find()
        .sort({ date: -1 })
        .limit(limit)
        .skip(offset)
        .exec(),
      this.userModel.countDocuments()
    ]);
    const totalPages = total === 0 ? 1 : Math.ceil(total / limit);
    return ({
      success: true, message: 'Users gotten successfully', data: {
        users,
        page,
        limit,
        totalPages,
        total
      }
    })
  }
}