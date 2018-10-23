import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskRepository } from '../@orm/task';
import { UserWorkRepository } from '../@orm/user-work';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { UserWorkController } from './user-work.controller';
import { UserWorkService } from './user-work.service';

@Module({
  controllers: [UserWorkController],
  exports: [UserWorkService],
  imports: [AuthModule, TypeOrmModule.forFeature([TaskRepository, UserWorkRepository]), ProjectModule],
  providers: [UserWorkService],
})
export class UserWorkModule {}
