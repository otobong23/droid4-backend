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
