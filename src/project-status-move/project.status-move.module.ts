import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRoleAllowedMove } from '@orm/project-role-allowed-move/project-role-allowed-move.entity';

import { ProjectModule } from '../project/project.module';

import { ProjectStatusMoveController } from './project.status-move.controller';
import { ProjectStatusMoveService } from './project.status-move.service';

@Module({
  controllers: [ProjectStatusMoveController],
  exports: [ProjectStatusMoveService],
  imports: [ProjectModule, TypeOrmModule.forFeature([ProjectRoleAllowedMove])],
  providers: [ProjectStatusMoveService],
})
export class ProjectStatusMoveModule {}
