import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserTaskCreateDto {
  @ApiModelProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiModelPropertyOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  taskId?: number;
}
