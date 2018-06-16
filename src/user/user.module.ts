import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from '../auth/auth.service';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from '../@entities/user';
import { RoleRepository } from '../@entities/role';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RoleRepository]), MailModule],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService],
})
export class UserModule {}
