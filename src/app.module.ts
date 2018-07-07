import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';
import { AuthModule } from './auth/auth.module';
import { MeModule } from './me/me.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { TaskTypeModule } from './task-type/task-type.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [AuthModule, MeModule, ProjectModule, TaskModule, TaskTypeModule, TypeOrmModule.forRoot(), UserModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
