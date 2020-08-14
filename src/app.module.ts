import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';

import { join } from 'path';

import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';
import { ValidationPipe } from './@common/pipes/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FileModule } from './file/file.module';
import { MeModule } from './me/me.module';
import { ProjectPartModule } from './project-part/project-part.module';
import { ProjectStatusMoveModule } from './project-status-move/project.status-move.module';
import { ProjectModule } from './project/project.module';
import { PublicProjectModule } from './public-project/public-project.module';
import { PublicModule } from './public/public.module';
import { RedisModule } from './redis/redis.module';
import { RoleModule } from './role/role.module';
import { SessionsModule } from './sessions/sessions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TaskCommentModule } from './task-comment/task-comment.module';
import { TaskStatusModule } from './task-status/task-status.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { TaskModule } from './task/task.module';
import { UserWorkModule } from './user-work/user-work.module';
import { UserModule } from './user/user.module';
import { WebHooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [
    AuthModule,
    FeedbackModule,
    FileModule,
    MeModule,
    ProjectModule,
    ProjectPartModule,
    ProjectStatusMoveModule,
    PublicProjectModule,
    PublicModule,
    RedisModule,
    RoleModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    SessionsModule,
    StatisticsModule,
    TaskModule,
    TaskCommentModule,
    TaskStatusModule,
    TaskTypeModule,
    TypeOrmModule.forRoot(),
    UserModule,
    UserWorkModule,
    WebHooksModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
