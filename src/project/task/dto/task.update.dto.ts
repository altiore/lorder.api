import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

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

  @ApiModelPropertyOptional()
  @IsString()
  @IsUrl()
  @IsOptional()
  source?: string;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  status?: number;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  performerId?: number;

  @ApiModelPropertyOptional({ isArray: true, type: Number, example: [1, 2, 3] })
  @IsNumber(undefined, { each: true })
  @IsOptional()
  users?: number[];
}
