import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from 'src/common/schema/user.module';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { UserTransactionModule } from 'src/common/schema/userTransaction.module';

@Module({
  imports: [
    UserModule,
    UserTransactionModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService, JwtStrategy],
  exports: [TransactionService]
})
export class TransactionModule { }
