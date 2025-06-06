import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Login } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  //login service functionalities 
  //start
  async login({ email, password }: Login) {
    const admin = process.env.ADMIN_EMAIL
    const adminPassword = process.env.ADMIN_PASSWORD

    if (admin === email && adminPassword === password) {
      return {
        user: { email, password },
        adminToken: this.jwtService.sign({ email, password }),
        message: 'login successful'
      };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
  //end
}
