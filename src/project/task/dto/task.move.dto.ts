import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskMoveDto {
  @ApiModelProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
