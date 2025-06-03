import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy'
import { config } from 'dotenv';
import { UserModule } from 'src/common/schema/user.module';
config()

@Module({
  imports: [
    UserModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, JwtStrategy],
  exports: [ProfileService]
})
export class ProfileModule { }
