import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskTypeDto {
  @ApiModelProperty()
  @IsString()
  @MaxLength(40)
  @MinLength(3)
  @IsNotEmpty()
  title: string;
}
