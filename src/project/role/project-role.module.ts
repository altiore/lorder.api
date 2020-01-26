import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRoleRepository } from '@orm/project-role';

import { ProjectModule } from '../project.module';

import { ProjectRoleController } from './project-role.controller';
import { ProjectRoleService } from './project-role.service';

@Module({
  controllers: [ProjectRoleController],
  exports: [ProjectRoleService],
  imports: [forwardRef(() => ProjectModule), TypeOrmModule.forFeature([ProjectRoleRepository])],
  providers: [ProjectRoleService],
})
export class ProjectRoleModule {}
