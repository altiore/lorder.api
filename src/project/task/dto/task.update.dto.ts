import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class TaskUpdateDto {
  @ApiModelPropertyOptional()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiModelPropertyOptional({ isArray: true, type: Number, example: [1, 2, 3] })
  @IsNumber(undefined, { each: true })
  @IsOptional()
  users?: number[];
}
