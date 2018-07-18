import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectRepository } from '../@orm/project';
import { TaskTypeRepository } from '../@orm/task-type';
import { ProjectTaskTypeRepository } from '../@orm/project-task-type';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { UserModule } from '../user/user.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    AuthModule,
    MailModule,
    UserModule,
    TypeOrmModule.forFeature([ProjectRepository, ProjectTaskTypeRepository, TaskTypeRepository]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
