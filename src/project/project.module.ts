import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { ProjectPubRepository } from '../@orm/project-pub';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskRepository } from '../@orm/task';
import { TaskTypeRepository } from '../@orm/task-type';
import { UserRepository } from '../@orm/user';
import { UserProjectRepository } from '../@orm/user-project';
import { UserWorkRepository } from '../@orm/user-work';
import { AuthModule } from '../auth/auth.module';
import { RedisModule } from '../redis/redis.module';
import { TaskModule } from '../task/task.module';
import { AccessLevelGuard } from './@common/guards';
import { ProjectMemberController } from './member/project.member.controller';
import { ProjectMemberService } from './member/project.member.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectTaskTypeController } from './task-type/project.task-type.controller';
import { ProjectTaskTypeService } from './task-type/project.task-type.service';
import { ProjectTaskController } from './task/project.task.controller';
import { ProjectTaskGateway } from './task/project.task.gateway';
import { ProjectTaskService } from './task/project.task.service';

@Module({
  controllers: [
    ProjectController,
    ProjectMemberController,
    ProjectTaskController,
    ProjectTaskTypeController,
  ],
  exports: [AccessLevelGuard, ProjectService, ProjectTaskGateway, ProjectMemberService],
  imports: [
    forwardRef(() => TaskModule),
    forwardRef(() => AuthModule),
    RedisModule.registerCache(),
    TypeOrmModule.forFeature([
      ProjectPubRepository,
      ProjectRepository,
      ProjectTaskTypeRepository,
      TaskRepository,
      TaskTypeRepository,
      UserRepository,
      UserProjectRepository,
      UserWorkRepository,
    ]),
  ],
  providers: [
    AccessLevelGuard,
    ProjectService,
    ProjectMemberService,
    ProjectTaskGateway,
    ProjectTaskService,
    ProjectTaskTypeService,
  ],
})
export class ProjectModule {}
