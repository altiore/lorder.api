import { ApiModelProperty } from '@nestjs/swagger';

import { UserWork } from '../../@orm/user-work';

export class UserWorkEditResultDto {
  @ApiModelProperty()
  edited: UserWork;

  @ApiModelProperty({ isArray: true, type: UserWork })
  removed: UserWork[];

  @ApiModelProperty({ isArray: true, type: UserWork })
  touched: UserWork[];
}
