import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';
import { ValidationPipe } from './@common/pipes/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import { FileModule } from './file/file.module';
import { MeModule } from './me/me.module';
import { ProjectModule } from './project/project.module';
import { PublicModule } from './public/public.module';
import { RedisModule } from './redis/redis.module';
import { StatisticsModule } from './statistics/statistics.module';
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
    PublicModule,
    RedisModule,
    StatisticsModule,
    TaskModule,
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
