import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { config } from 'dotenv';
import { UserModule } from 'src/common/schema/user.module';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { CopyTrading, CopyTradingSchema } from 'src/copy-trading/entities/copy-trading.entity';
config()


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CopyTrading.name, schema: CopyTradingSchema },
    ]),
    UserModule,
  ],
  controllers: [SeedController],
  providers: [SeedService, JwtStrategy],
  exports: [SeedService],
})
export class SeedModule { }

