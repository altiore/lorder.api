import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { MeController } from './me.controller';
import { MeService } from './me.service';

@Module({
  controllers: [MeController],
  exports: [MeService],
  imports: [UserModule],
  providers: [MeService],
})
export class MeModule {}
