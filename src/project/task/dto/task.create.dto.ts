import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class TaskCreateDto {
  @ApiModelProperty()
  @MaxLength(140)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

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

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  typeId?: number;

  @ApiModelPropertyOptional({ isArray: true, type: Number, example: [1, 2, 3] })
  @IsNumber(undefined, { each: true })
  @IsOptional()
  users?: number[];
}
