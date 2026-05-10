import { Module } from '@nestjs/common';
import { CopyTradingService } from './copy-trading.service';
import { CopyTradingController } from './copy-trading.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CopyTrading, CopyTradingSchema } from './entities/copy-trading.entity';
import { Trade, TradeSchema } from './entities/trade.entity';
import { UserModule } from 'src/common/schema/user.module';
import { UserTransactionModule } from 'src/common/schema/userTransaction.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CopyTrading.name, schema: CopyTradingSchema},
      { name: Trade.name, schema: TradeSchema}
    ]),
    UserModule,
    UserTransactionModule,
  ],
  controllers: [CopyTradingController],
  providers: [CopyTradingService],
  exports: [CopyTradingService]
})
export class CopyTradingModule {}
