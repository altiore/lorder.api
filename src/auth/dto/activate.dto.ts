import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ActivateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly oneTimeToken: string;

  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly project?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly device: string;
}
