import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { TASK_FLOW_STRATEGY } from '../../../@domains/strategy';
import { PROJECT_TYPE } from '../../entities/project.entity';

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

  @ApiPropertyOptional()
  @MaxLength(253)
  @MinLength(20)
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiPropertyOptional()
  @MaxLength(140)
  @MinLength(20)
  @IsString()
  @IsOptional()
  slogan?: string;

  @ApiPropertyOptional()
  @IsIn(Object.values(TASK_FLOW_STRATEGY))
  @IsString()
  @IsOptional()
  strategy?: TASK_FLOW_STRATEGY;
}
