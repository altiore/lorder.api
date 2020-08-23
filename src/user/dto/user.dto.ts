import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsOptional } from 'class-validator';
import { toArray } from 'lodash';

import { ROLES } from '@orm/entities/role.entity';

export class UserDto {
  @ApiPropertyOptional()
  @IsIn(toArray(ROLES))
  @IsOptional()
  public readonly role: ROLES;
}
