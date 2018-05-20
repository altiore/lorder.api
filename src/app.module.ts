import { APP_GUARD } from '@nestjs/core';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { RolesGuard } from './@common/guards/roles.guard';

// import { LoggerMiddleware } from './@common/middlewares/logger.middleware';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forRoot(),
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(LoggerMiddleware)
    //   .with('testValue')
    //   .forRoutes('/users');
  }
}
