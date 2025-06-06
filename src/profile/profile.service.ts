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

  async findAllUsers(){
    const users = await this.userModel.find()
    return users ? users : [];
  }
}