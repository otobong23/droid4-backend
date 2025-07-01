import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schema/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly jwtService: JwtService) {
  }

  async getUserProfile({ email }: { email: string }) {
    const existingUser = await this.userModel.findOne({ email })
    if (existingUser) {
      return { ...existingUser.toObject(), phrase: existingUser.phrase.split('_').join(' ') }
    } else {
      throw new NotFoundException('User not Found, please signup')
    }
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

  async findAllUsers() {
    const users = await this.userModel.find()
    return users ? users : [];
  }
}