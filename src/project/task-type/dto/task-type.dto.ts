import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskTypeDto {
  @ApiModelProperty()
  @IsNumber()
  @IsNotEmpty()
  taskTypeId: number;
}
