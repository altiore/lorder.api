import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PaginationDto<Entity> {
  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly count?: number;

  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly skip?: number;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly orderBy?: keyof Entity;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public readonly order?: 'asc' | 'desc';
}
