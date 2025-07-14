import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Login } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { config } from 'dotenv';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from 'src/common/schema/admin.schema';
import { Model } from 'mongoose';
config();

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Admin.name) private adminSchemaModel: Model<AdminDocument>,
  ) { }

  //login service functionalities 
  //start
  async login({ email, password }: Login) {
    const admin = process.env.ADMIN_EMAIL
    if (admin === email) {
      const existingAdmin = await this.adminSchemaModel.findOne()
      if (!existingAdmin) {
        const newAdmin = new this.adminSchemaModel({ email: admin })
        await newAdmin.save()
      }
      if (existingAdmin?.password !== password) throw new UnauthorizedException('Invalid credentials');
      return {
        success: true,
        adminToken: this.jwtService.sign({ email, password }),
        message: 'login successful'
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  //end
}
