import { Module } from '@nestjs/common';

import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [MailModule, UserModule],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
