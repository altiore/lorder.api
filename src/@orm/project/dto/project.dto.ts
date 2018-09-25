import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class ProjectDto {
  @ApiModelProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  monthlyBudget?: number;
}
