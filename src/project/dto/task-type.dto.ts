import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskTypeDto {
  @ApiModelProperty()
  @IsNotEmpty({ message: 'Добавьте хотя бы один тип задачи' })
  @IsNumber()
  public readonly id: number;
}