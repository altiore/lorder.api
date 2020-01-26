import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserWorkRepository } from '../@orm/user-work';
import { AuthModule } from '../auth/auth.module';
import { ProjectModule } from '../project/project.module';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';

import { UserWorkController } from './user-work.controller';
import { UserWorkService } from './user-work.service';

@Module({
  controllers: [UserWorkController],
  exports: [UserWorkService],
  imports: [AuthModule, TaskModule, TypeOrmModule.forFeature([UserWorkRepository]), ProjectModule, UserModule],
  providers: [UserWorkService],
})
export class UserWorkModule {}
