import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoleModule } from '../../role/role.module';
import { ProjectModule } from '../project.module';
import { ProjectRoleController } from './project-role.controller';
import { ProjectRoleRepository } from './project-role.repository';
import { ProjectRoleService } from './project-role.service';

@Module({
  controllers: [ProjectRoleController],
  exports: [ProjectRoleService],
  imports: [forwardRef(() => ProjectModule), TypeOrmModule.forFeature([ProjectRoleRepository]), RoleModule],
  providers: [ProjectRoleService],
})
export class ProjectRoleModule {}
