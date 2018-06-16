import { Module } from '@nestjs/common';

import { MeController } from './me.controller';
import { MeService } from './me.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MeController],
  providers: [MeService],
  exports: [MeService],
})
export class MeModule {}
