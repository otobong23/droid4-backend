import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, RequestTimeoutException } from '@nestjs/common';
import * as bip39 from 'bip39';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schema/user.schema'; // ✅ correct model
import { JwtService } from '@nestjs/jwt';
import { sendActivationMail } from 'src/common/helpers/mailer';

@Injectable()
export class SeedService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly jwtService: JwtService) { }

  normalize = (str: string) => str.replace(/\s+/g, ' ').trim().split(' ').join('_');

  async generateSeed(): Promise<string> {
    return bip39.generateMnemonic();
  }

  async storeSeed(email: string, phrase: string): Promise<{ message: string }> {
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new ConflictException('Seed phrase already exists for this email');
    }

    const cleanPhrase = this.normalize(phrase);

    // const hashed = await bcrypt.hash(cleanPhrase, 10);
    const newUser = new this.userModel({ email, phrase: cleanPhrase });
    await newUser.save();

    return { message: 'Seed phrase saved successfully' }
  }

  async validateSeed(email: string, inputPhrase: string): Promise<{ email: string, phrase: string, token: string } | false> {
    const record = await this.userModel.findOne({ email });
    if (!record) {
      console.log('❌ No record found for email:', email);
      return false;
    }
    const cleanInput = this.normalize(inputPhrase);

    console.log('🔐 Clean input:', cleanInput);
    console.log('🗄️ Stored hash:', record.phrase);

    const result = cleanInput === record.phrase
    if (result) {
      const payload = { email }
      const token = this.jwtService.sign(payload);
      return { email, phrase: inputPhrase, token };
    } else {
      throw new ConflictException('incorrect pharse')
    }
  }

  async findByEmail(email: string) {
    if(!email) throw new ForbiddenException('email is needed')
    const existingUser = await this.userModel.findOne({ email })
    if(existingUser) throw new ConflictException('User Already Exist')
    return true
  }


  //sendCode service functionalities
  //start
  async sendCode(email) {
    const existingUser = await this.userModel.findOne({ email });
    if (!existingUser) throw new NotFoundException("User doesn't exists");
    if (existingUser.isVerified) throw new ConflictException('User Is already Verified')
    const code = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const info = await sendActivationMail(email, existingUser.email, code)
    if (!info) {
      throw new InternalServerErrorException(`Failed to send to Code to ${email}`)
    }
    existingUser.activationCode = code
    existingUser.activationCodeValidation = Date.now()
    existingUser.save()

    return { message: 'Code Sent Successfully!' }
  }
  //end

  //verifyCode service functionalities
  //start
  async verifyCode(email, code) {
    const existingUser = await this.userModel.findOne({ email }).select('+activationCode +activationCodeValidation')
    if (!existingUser) {
      throw new NotFoundException("User doesn't exists");
    }
    if (!existingUser.activationCode || !existingUser.activationCodeValidation) {
      throw new InternalServerErrorException('Something Went Wrong')
    }
    if (Date.now() - new Date(existingUser.activationCodeValidation).getTime() > 10 * 60 * 1000) {
      throw new RequestTimeoutException('Code Has Been Expired!')
    }
    if (code === existingUser.activationCode) {
      existingUser.activationCode = undefined
      existingUser.activationCodeValidation = undefined
      existingUser.isVerified = true
      existingUser.verificationStatus = 'verified'
      await existingUser.save()
      return { message: 'Your Email has been verified successfully' }
    } else {
      throw new ConflictException('Code is Invalid')
    }
  }
  //end
}
