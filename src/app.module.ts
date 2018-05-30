import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { RolesGuard } from './@common/guards/roles.guard';
import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';

@Module({
  imports: [AuthModule, TypeOrmModule.forRoot(), UserModule, ProjectModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
