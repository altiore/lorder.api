import { ApiProperty } from '@nestjs/swagger';

import { UserWork } from '@orm/entities/user-work.entity';

export class StopResponse {
  @ApiProperty({ type: UserWork })
  next: UserWork;

  @ApiProperty({ type: UserWork })
  previous: UserWork;
}
