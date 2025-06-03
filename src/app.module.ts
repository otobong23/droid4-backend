import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';;
import { SeedModule } from './seed/seed.module';
import { ProfileModule } from './profile/profile.module';
import { config } from 'dotenv';
import { TransactionModule } from './transaction/transaction.module';
import { JwtSharedModule } from './common/jwt/jwt.module';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@nestjs/core';
config()

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || ''),
    JwtSharedModule,
    SeedModule, ProfileModule, TransactionModule, AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
