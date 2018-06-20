import { IsString, IsOptional, Length } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

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
}
