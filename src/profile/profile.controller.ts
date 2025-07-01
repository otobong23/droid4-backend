import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from 'src/common/jwt/jwt-auth.guard';
import { CryptoService } from 'src/common/helpers/CryptoRate.service';
import { SwapDto } from './dto/profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService, private readonly cryptoService: CryptoService) { }

  @Get()
  getProfile(@Req() req) {
    return this.profileService.getUserProfile(req.user)
  }

  @Patch('fullname')
  async updateFullname(@Req() req, @Body('fullname') fullname: string) {
    return this.profileService.updateUserFullname(req.user.email, fullname)
  }

  @Patch('country')
  async updateCountry(@Req() req, @Body('country') country: string) {
    return this.profileService.updateUserCountry(req.user.email, country)
  } 

  @Patch('phone')
  async updatePhone(@Req() req, @Body('phone') phone: string) {
    return this.profileService.updateUserPhone(req.user.email, phone)
  }

  @Patch('address')
  async updateAddress(@Req() req, @Body('address') address: string) {
    return this.profileService.updateUserAddress(req.user.email, address)
  }

  @Patch('verificationStatus')
  async verificationStatus(@Req() req, @Body('verificationStatus') verificationStatus: 'pending' | 'verified') {
    return this.profileService.updateVerification(req.user.email, verificationStatus)
  }

  @Patch('KYC')
  async KYC(@Req() req, @Body('KYC') KYC: string) {
    return this.profileService.updateKYC(req.user.email, KYC)
  }

  @Patch('KYCVerified')
  async KYCVerified(@Req() req, @Body('KYCVerified') KYCVerified: boolean) {
    return this.profileService.updateKYCVerified(req.user.email, KYCVerified)
  }

  @Patch('KYCVerificationStatus')
  async KYCVerificationStatus(@Req() req, @Body('KYCVerificationStatus') KYCVerificationStatus: 'pending' | 'verified') {
    return this.profileService.updateKYCVerificationStatus(req.user.email, KYCVerificationStatus)
  }

  @Get('crypto/:coin')
  async getCoinPrice(@Param('coin') coin: string) {
    const price = await this.cryptoService.getPriceUSD(coin);
    return { [coin]: price };
  }

  @Post('crypto/swap')
  async swap(@Body() swapDto: SwapDto) {
    return this.cryptoService.swap(swapDto.from, swapDto.to, swapDto.amount);
  }
}
