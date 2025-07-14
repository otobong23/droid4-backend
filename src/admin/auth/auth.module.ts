import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from 'src/common/jwt/jwt.strategy';
import { config } from 'dotenv';
import { AdminSchemaModule } from 'src/common/schema/adminSchema.module';
config()

@Module({
  imports: [AdminSchemaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy]
})
export class AuthModule { }
