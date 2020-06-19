import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class TaskMoveDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  statusTypeName: string;
}
