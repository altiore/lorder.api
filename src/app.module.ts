import { Module } from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';
import { ValidationPipe } from './@common/pipes/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { ProjectModule } from './project/project.module';
import { RedisModule } from './redis/redis.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, MeModule, ProjectModule, RedisModule, TaskTypeModule, TypeOrmModule.forRoot(), UserModule],
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
