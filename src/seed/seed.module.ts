import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { config } from 'dotenv';
import { UserModule } from 'src/common/schema/user.module';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
config()


@Module({
  imports: [
    UserModule,
  ],
  controllers: [SeedController],
  providers: [SeedService, JwtStrategy],
  exports: [SeedService],
})
export class SeedModule { }

