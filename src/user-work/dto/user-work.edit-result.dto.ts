import { ApiProperty } from '@nestjs/swagger';

import { UserWork } from '@orm/user-work';

export class UserWorkEditResultDto {
  @ApiProperty()
  edited: UserWork;

  @ApiProperty({ isArray: true, type: UserWork })
  removed: UserWork[];

  @ApiProperty({ isArray: true, type: UserWork })
  touched: UserWork[];
}
