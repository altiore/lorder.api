import { ApiProperty } from '@nestjs/swagger';

import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { TASK_STATUS_TYPE } from '@orm/task';

export class TaskMoveDto {
  @ApiProperty()
  @IsString()
  @IsIn(Object.values(TASK_STATUS_TYPE))
  @IsNotEmpty()
  statusTypeName?: TASK_STATUS_TYPE;
}
