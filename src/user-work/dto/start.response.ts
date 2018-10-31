import { ApiModelProperty } from '@nestjs/swagger';

import { UserWork } from '../../@orm/user-work';

export class StartResponse {
  @ApiModelProperty({ type: UserWork, isArray: true })
  finished: UserWork[];

  @ApiModelProperty({ type: UserWork })
  started: UserWork;
}
