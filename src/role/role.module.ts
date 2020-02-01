import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleRepository } from '@orm/role';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  exports: [RoleService],
  imports: [TypeOrmModule.forFeature([RoleRepository])],
  providers: [RoleService],
})
export class RoleModule {}
