import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { toArray } from 'lodash';

import { ROLES } from '@orm/role';

export class UserDto {
  @ApiModelPropertyOptional()
  @IsIn(toArray(ROLES))
  @IsOptional()
  public readonly role: ROLES;
}
