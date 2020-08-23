import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectPubRepository } from '@orm/project-pub/project-pub.repository';
import { ProjectTaskTypeRepository } from '@orm/project-task-type/project-task-type.repository';
import { ProjectRepository } from '@orm/project/project.repository';
import { TaskTypeRepository } from '@orm/task-type/task-type.repository';
import { UserProjectRepository } from '@orm/user-project/user-project.repository';
import { UserWorkRepository } from '@orm/user-work/user-work.repository';
import { UserRepository } from '@orm/user/user.repository';

import { AuthModule } from 'auth/auth.module';

import { FileModule } from '../file/file.module';
import { RedisModule } from '../redis/redis.module';
import { TaskModule } from '../task/task.module';
import { AccessLevelGuard } from './@common/guards';
import { ProjectMemberController } from './member/project.member.controller';
import { ProjectMemberService } from './member/project.member.service';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectRoleModule } from './role/project-role.module';
import { ProjectTaskTypeController } from './task-type/project.task-type.controller';
import { ProjectTaskTypeService } from './task-type/project.task-type.service';
import { ProjectTaskController } from './task/project.task.controller';
import { ProjectTaskService } from './task/project.task.service';
import { TaskLogModule } from './task/task-log/task-log.module';

@Module({
  controllers: [ProjectController, ProjectMemberController, ProjectTaskController, ProjectTaskTypeController],
  exports: [AccessLevelGuard, ProjectService, ProjectTaskService, ProjectMemberService],
  imports: [
    FileModule,
    forwardRef(() => AuthModule),
    forwardRef(() => TaskLogModule),
    forwardRef(() => TaskModule),
    forwardRef(() => ProjectRoleModule),
    RedisModule.registerCache(),
    TypeOrmModule.forFeature([
      ProjectPubRepository,
      ProjectRepository,
      ProjectTaskTypeRepository,
      TaskTypeRepository,
      UserRepository,
      UserProjectRepository,
      UserWorkRepository,
    ]),
  ],
  providers: [AccessLevelGuard, ProjectService, ProjectMemberService, ProjectTaskService, ProjectTaskTypeService],
})
export class ProjectModule {}
