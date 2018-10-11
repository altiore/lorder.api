import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskRepository } from '../@orm/task';
import { TaskTypeRepository } from '../@orm/task-type';
import { UserProjectRepository } from '../@orm/user-project';
import { AuthModule } from '../auth/auth.module';
import { AccessLevelGuard } from './@common/guards';
import { ProjectMemberController } from './member/project.member.controller';
import { ProjectMemberService } from './member/project.member.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectTaskTypeController } from './task-type/project.task-type.controller';
import { ProjectTaskTypeService } from './task-type/project.task-type.service';
import { ProjectTaskController } from './task/project.task.controller';
import { ProjectTaskService } from './task/project.task.service';

@Module({
  controllers: [ProjectController, ProjectMemberController, ProjectTaskController, ProjectTaskTypeController],
  exports: [ProjectService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ProjectRepository,
      ProjectTaskTypeRepository,
      TaskRepository,
      TaskTypeRepository,
      UserProjectRepository,
    ]),
  ],
  providers: [ProjectService, ProjectMemberService, ProjectTaskService, ProjectTaskTypeService, AccessLevelGuard],
})
export class ProjectModule {}
