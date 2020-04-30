import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { PROJECT_TYPE } from '../project.entity';

export class ProjectDto {
  @ApiProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  monthlyBudget?: number;

  @ApiPropertyOptional()
  @IsIn(Object.values(PROJECT_TYPE))
  @IsOptional()
  type?: PROJECT_TYPE;
}
