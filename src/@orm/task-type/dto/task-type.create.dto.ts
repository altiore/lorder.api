import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class TaskTypeCreateDto {
  @ApiModelProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;
}
