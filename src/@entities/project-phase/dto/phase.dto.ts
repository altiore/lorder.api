import { IsNotEmpty, IsString, MinLength, MaxLength, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class PhaseDto {
  @ApiModelProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiModelProperty()
  @IsNumber()
  projectId: number;
}
