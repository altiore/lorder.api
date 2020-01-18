import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @Length(12, 24)
  @IsString()
  @IsOptional()
  public readonly tel?: string;

  @ApiPropertyOptional()
  @Length(3, 64)
  @IsString()
  @IsOptional()
  public displayName?: string;
}
