// src/seed/seed.controller.ts
import { Body, Controller, Post, ConflictException, BadRequestException, Get, Query, Patch } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ValidateSeedDto } from './dto/validate-seed.dto';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService,
  ) { }

  @Get()
  async generate() {
    try {
      const phrase = await this.seedService.generateSeed(); // just generate
      return { phrase };
    } catch (error) {
      console.error('Seed generation failed:', error);
      throw new BadRequestException('Unable to generate seed phrase');
    }
  }

  // src/seed/seed.controller.ts

  @Post('save')
  async saveSeed(@Body() body: ValidateSeedDto) {
    const { email, phrase } = body;
    return this.seedService.storeSeed(email, phrase)
  }


  @Post('login')
  async login(@Body() body: ValidateSeedDto) {
    const { email, phrase } = body;
    const isValid = await this.seedService.validateSeed(email, phrase);
    return isValid
  }

  @Get('checkUser')
  async checkUser(@Query("email") email: string){
    return await this.seedService.findByEmail(email)
  }

  @Patch('sendCode')
  async sendCode(@Query("email") email: string){
    return await this.seedService.sendCode(email)
  }

  @Patch('verifyCode')
  async verifyCode(@Query("email") email: string, @Query("code") code: string){
    return await this.seedService.verifyCode(email, code)
  }
}
