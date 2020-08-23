import { ApiProperty } from '@nestjs/swagger';

import { UserWork } from '@orm/entities/user-work.entity';

export class StartResponse {
  @ApiProperty({ type: UserWork, isArray: true })
  finished: UserWork[];

  @ApiProperty({ type: UserWork })
  started: UserWork;
}
