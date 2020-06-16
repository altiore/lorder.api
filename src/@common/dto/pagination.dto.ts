import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationDto<OrderBy = string> {
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly count?: number;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly skip?: number;

  @ApiPropertyOptional({ type: 'id' })
  @IsString()
  @IsOptional()
  public readonly orderBy?: OrderBy;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public readonly order?: 'asc' | 'desc';
}
