import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackRepository } from '@orm/feedback';

import { UserModule } from '../user/user.module';

import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

@Module({
  controllers: [FeedbackController],
  exports: [FeedbackService],
  imports: [UserModule, TypeOrmModule.forFeature([FeedbackRepository])],
  providers: [FeedbackService],
})
export class FeedbackModule {}
