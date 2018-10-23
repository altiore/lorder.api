import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserWorkStopDto {
  @ApiModelProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
