import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class PagesDto {
  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly count?: number;

  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly skeep?: number;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly orderBy?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly order?: string;
}
