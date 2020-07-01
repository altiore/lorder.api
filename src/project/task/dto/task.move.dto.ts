import { ApiProperty } from '@nestjs/swagger';

import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { COLUMN_TYPE, STATUS_NAME } from '../../../@domains/strategy';

export class TaskMoveDto {
  @ApiProperty()
  @IsString()
  @IsIn([...Object.values(STATUS_NAME), ...Object.values(COLUMN_TYPE)])
  @IsNotEmpty()
  statusTypeName?: STATUS_NAME;
}
