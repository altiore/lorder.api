import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleRepository } from '../@orm/role';
import { UserRepository } from '../@orm/user';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([UserRepository, RoleRepository]), MailModule],
  providers: [UserService],
})
export class UserModule {}
