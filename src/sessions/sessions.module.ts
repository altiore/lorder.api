import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Session } from '@orm/entities/session.entity';

import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  controllers: [SessionsController],
  exports: [SessionsService],
  imports: [TypeOrmModule.forFeature([Session])],
  providers: [SessionsService, SessionsService],
})
export class SessionsModule {}
