import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationDto<OrderBy = string> {
  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly count?: number;

  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly skip?: number;

  @ApiModelPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  public readonly orderBy?: OrderBy;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public readonly order?: 'asc' | 'desc';
}
