import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { COLUMN_TYPE, ROLE, STATUS_NAME } from '../../../@domains/strategy';

export class TaskMoveDto {
  @ApiProperty()
  @IsString()
  @IsIn([...Object.values(STATUS_NAME), ...Object.values(COLUMN_TYPE)])
  @IsNotEmpty()
  statusTypeName?: STATUS_NAME;

  @ApiPropertyOptional()
  @IsString()
  @IsIn(Object.values(ROLE))
  @IsOptional()
  selectedRole?: ROLE;
}
