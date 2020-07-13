import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

import { COLUMN_TYPE, STATUS_NAME } from '../../../@domains/strategy';
import { COMPLEXITY_NAME, URGENCY_NAME } from '../../../@orm/user-task';

export class TaskUpdateDto {
  @ApiPropertyOptional()
  @MaxLength(140)
  @MinLength(3)
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsUrl()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  status?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsIn([...Object.values(STATUS_NAME), ...Object.values(COLUMN_TYPE)])
  @IsOptional()
  statusTypeName?: STATUS_NAME;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  performerId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  typeId?: number;

  @ApiPropertyOptional({ isArray: true })
  @IsNumber(undefined, { each: true })
  @IsOptional()
  projectParts?: number[];

  @ApiPropertyOptional({ enum: COMPLEXITY_NAME })
  @IsString()
  @IsIn(Object.values(COMPLEXITY_NAME))
  @IsOptional()
  complexity?: COMPLEXITY_NAME;

  @ApiPropertyOptional({ enum: URGENCY_NAME })
  @IsString()
  @IsIn(Object.values(URGENCY_NAME))
  @IsOptional()
  urgency?: URGENCY_NAME;
}
