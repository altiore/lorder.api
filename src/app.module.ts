import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { RolesGuard } from './@common/guards/roles.guard';
import { AllExceptionsFilter } from './@common/filters/all-exceptions.filter';

// import { LoggerMiddleware } from './@common/middlewares/logger.middleware';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(),
  ],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(LoggerMiddleware)
    //   .with('testValue')
    //   .forRoutes('/users');
  }
}
