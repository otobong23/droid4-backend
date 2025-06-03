// src/seed/seed.controller.ts
import { Body, Controller, Post, ConflictException, BadRequestException, Get } from '@nestjs/common';
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

    try {
      const user = await this.seedService.findByEmail(email);
      if (user) {
        throw new BadRequestException('User Already exists');
      }

      await this.seedService.storeSeed(email, phrase);

      return { message: 'Seed phrase saved successfully' };
    } catch (error) {
      throw new BadRequestException('Seed saving failed:', error);
    }
  }




  @Post('login')
  async login(@Body() body: ValidateSeedDto) {
    const { email, phrase } = body;
    const isValid = await this.seedService.validateSeed(email, phrase);
    return isValid
  }
}
