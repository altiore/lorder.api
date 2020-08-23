import { forwardRef, Global, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProjectRepository } from '@orm/user-project/user-project.repository';
import { UserRepository } from '@orm/user/user.repository';

import { MailModule } from '../mail/mail.module';
import { RedisModule } from '../redis/redis.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Global()
@Module({
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard],
  imports: [
    HttpModule,
    MailModule,
    RedisModule,
    SessionsModule,
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserProjectRepository, UserRepository]),
  ],
  providers: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
