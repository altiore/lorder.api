import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class IdDto {
  @ApiModelProperty()
  @IsNumber()
  @IsNotEmpty()
  public readonly id: number;
}
