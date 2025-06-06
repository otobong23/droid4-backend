import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserModule } from 'src/common/schema/user.module';
import { UserTransactionModule } from 'src/common/schema/userTransaction.module';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { ProfileModule } from 'src/profile/profile.module';
import { TransactionModule } from 'src/transaction/transaction.module';

@Module({
  imports: [
    UserModule,
    UserTransactionModule,
    ProfileModule,
    TransactionModule
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
})
export class UsersModule { }
