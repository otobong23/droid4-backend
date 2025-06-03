import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { UserModule } from 'src/common/schema/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { UserTransactionModule } from 'src/common/schema/userTransaction.module';

@Module({
  imports: [
    UserModule,
    UserTransactionModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET!, // store securely!
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, JwtStrategy],
})
export class TransactionModule { }
