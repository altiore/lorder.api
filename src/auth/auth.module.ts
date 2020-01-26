import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../@orm/user';
import { UserProjectRepository } from '../@orm/user-project';
import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  imports: [MailModule, RedisModule, UserModule, TypeOrmModule.forFeature([UserProjectRepository, UserRepository])],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
