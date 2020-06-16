import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskTypeDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  taskTypeId: number;
}
