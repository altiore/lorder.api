import { ApiProperty } from '@nestjs/swagger';

import { UserWork } from '../../@orm/user-work';

export class StopResponse {
  @ApiProperty({ type: UserWork })
  next: UserWork;

  @ApiProperty({ type: UserWork })
  previous: UserWork;
}
