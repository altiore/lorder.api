import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Validate } from 'class-validator';

import { IsMomentString, LaterThenField, MomentMaxDate } from '../../@common/validators';

export class UserWorkPatchDto {
  @ApiPropertyOptional()
  @MaxLength(255)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '2018-05-26T09:05:39.378Z' })
  @Validate(IsMomentString)
  @Validate(MomentMaxDate)
  @IsOptional()
  startAt?: string;

  @ApiPropertyOptional({ example: '2018-05-26T09:05:39.378Z' })
  @Validate(LaterThenField, ['startAt'])
  @Validate(MomentMaxDate)
  @Validate(IsMomentString)
  @IsOptional()
  finishAt?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiPropertyOptional()
  @MaxLength(255)
  @IsString()
  @IsOptional()
  source?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taskId?: number;

  // validated during check access
  @ApiProperty()
  @IsNotEmpty()
  projectId: number;
}
