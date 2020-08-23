import { ApiProperty } from '@nestjs/swagger';

import { UserWork } from '@orm/entities/user-work.entity';

export class UserWorkEditResultDto {
  @ApiProperty()
  edited: UserWork;

  @ApiProperty({ isArray: true, type: UserWork })
  removed: UserWork[];

  @ApiProperty({ isArray: true, type: UserWork })
  touched: UserWork[];
}
