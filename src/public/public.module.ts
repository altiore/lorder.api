import { Module } from '@nestjs/common';

import { ProjectModule } from '../project/project.module';
import { PublicController } from './public.controller';

@Module({
  controllers: [PublicController],
  exports: [],
  imports: [ProjectModule],
  providers: [],
})
export class PublicModule {}
