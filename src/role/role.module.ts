import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleFlow } from '@orm/entities/role-flow.entity';

import { RoleController } from './role.controller';
import { RoleService } from './role.service';

@Module({
  controllers: [RoleController],
  exports: [RoleService],
  imports: [TypeOrmModule.forFeature([RoleFlow])],
  providers: [RoleService],
})
export class RoleModule {}
