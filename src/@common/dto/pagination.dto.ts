import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumberString, IsOptional, IsString } from 'class-validator';

enum DefaultFieldsEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export class PaginationDto<AllowedFieldsEnum = DefaultFieldsEnum> {
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
  public readonly orderBy?: AllowedFieldsEnum;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  @IsIn(['asc', 'desc'])
  public readonly order?: 'asc' | 'desc';
}
