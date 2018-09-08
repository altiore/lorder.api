import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiModelPropertyOptional()
  @Length(12, 24)
  @IsString()
  @IsOptional()
  public readonly tel?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly resetLink?: string;

  @ApiModelPropertyOptional()
  @IsString()
  @IsOptional()
  public password?: string;
}
