import { ConflictException, Injectable } from '@nestjs/common';
import * as bip39 from 'bip39';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../common/schema/user.schema'; // ✅ correct model
import { JwtService } from '@nestjs/jwt';

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
    return this.userModel.findOne({ email })
  }
}
