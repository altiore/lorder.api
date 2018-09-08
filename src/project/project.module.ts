import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { UserProjectRepository } from '../@orm/user-project';
import { AuthModule } from '../auth/auth.module';
import { ProjectController } from './project.controller';
import { ProjectMemberController } from './project.member.controller';
import { ProjectService } from './project.service';
import { ProjectTaskTypeController } from './project.task-type.controller';

@Module({
  controllers: [ProjectController, ProjectMemberController, ProjectTaskTypeController],
  exports: [ProjectService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([ProjectRepository, ProjectTaskTypeRepository, TaskTypeRepository, UserProjectRepository]),
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
