import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ListDto<OrderBy = string> {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly count?: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly startId?: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly endId?: number;

  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  public readonly orderBy?: OrderBy;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public readonly order?: 'asc' | 'desc';
}
