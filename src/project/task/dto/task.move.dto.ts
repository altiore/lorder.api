import { ApiProperty } from '@nestjs/swagger';

import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { STATUS_NAME } from '@orm/task-status/task-status.entity';

export class TaskMoveDto {
  @ApiProperty()
  @IsString()
  @IsIn(Object.values(STATUS_NAME))
  @IsNotEmpty()
  statusTypeName?: STATUS_NAME;
}
