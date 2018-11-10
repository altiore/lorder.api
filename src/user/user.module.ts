import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { RoleRepository } from '../@orm/role';
import { UserRepository } from '../@orm/user';
import { UserProjectRepository } from '../@orm/user-project';
import { MailModule } from '../mail/mail.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserRepository, RoleRepository, ProjectRepository, UserProjectRepository]),
    MailModule,
  ],
  providers: [UserService],
})
export class UserModule {}
