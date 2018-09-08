import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { TaskTypeRepository } from '../@orm/task-type';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { ProjectTaskTypeController } from './project.task-type.controller';

@Module({
  controllers: [ProjectController, ProjectTaskTypeController],
  exports: [ProjectService],
  imports: [
    AuthModule,
    MailModule,
    UserModule,
    TypeOrmModule.forFeature([ProjectRepository, ProjectTaskTypeRepository, TaskTypeRepository]),
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
