import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../@orm/user';

@Module({
  controllers: [AuthController],
  imports: [MailModule, UserModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
