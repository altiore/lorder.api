import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleRepository } from '@orm/role';
import { UserRepository } from '@orm/user';

import { FileModule } from '../file/file.module';
import { ProjectModule } from '../project/project.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [FileModule, ProjectModule, TypeOrmModule.forFeature([UserRepository, RoleRepository])],
  providers: [UserService],
})
export class UserModule {}
