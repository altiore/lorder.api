import { ApiModelProperty } from '@nestjs/swagger';

import { UserWork } from '../../@orm/user-work';

export class StopResponse {
  @ApiModelProperty({ type: UserWork })
  next: UserWork;

  @ApiModelProperty({ type: UserWork })
  previous: UserWork;
}
