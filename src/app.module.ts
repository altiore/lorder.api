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
import { ProjectStatusMoveModule } from './project-status-move/project.status-move.module';
import { ProjectModule } from './project/project.module';
import { PublicModule } from './public/public.module';
import { RedisModule } from './redis/redis.module';
import { RoleModule } from './role/role.module';
import { StatisticsModule } from './statistics/statistics.module';
import { TaskStatusModule } from './task-status/task-status.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { TaskModule } from './task/task.module';
import { UserWorkModule } from './user-work/user-work.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AuthModule,
    FeedbackModule,
    FileModule,
    MeModule,
    ProjectModule,
    ProjectStatusMoveModule,
    PublicModule,
    RedisModule,
    RoleModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    StatisticsModule,
    TaskModule,
    TaskStatusModule,
    TaskTypeModule,
    TypeOrmModule.forRoot(),
    UserModule,
    UserWorkModule,
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
