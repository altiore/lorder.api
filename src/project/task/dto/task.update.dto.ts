import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsNumber, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

import { COLUMN_TYPE, STATUS_NAME } from '../../../@domains/strategy';
import { COMPLEXITY, URGENCY } from '../../../@orm/user-task';

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

  @ApiPropertyOptional({ enum: COMPLEXITY })
  @IsString()
  @IsIn(Object.values(COMPLEXITY))
  @IsOptional()
  complexity?: COMPLEXITY;

  @ApiPropertyOptional({ enum: URGENCY })
  @IsString()
  @IsIn(Object.values(URGENCY))
  @IsOptional()
  urgency?: URGENCY;
}
