import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy'
import { config } from 'dotenv';
import { UserModule } from 'src/common/schema/user.module';
import { CryptoService } from 'src/common/helpers/CryptoRate.service';
import { AdminSchemaModule } from 'src/common/schema/adminSchema.module';
config()

@Module({
  imports: [
    UserModule,
    AdminSchemaModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, CryptoService, JwtStrategy],
  exports: [ProfileService]
})
export class ProfileModule { }
