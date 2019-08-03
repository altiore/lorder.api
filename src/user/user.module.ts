import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleRepository } from '../@orm/role';
import { UserRepository } from '../@orm/user';
import { FileModule } from '../file/file.module';
import { MailModule } from '../mail/mail.module';
import { ProjectModule } from '../project/project.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserRepository, RoleRepository]),
    FileModule,
    MailModule,
    ProjectModule,
  ],
  providers: [UserService],
})
export class UserModule {}
