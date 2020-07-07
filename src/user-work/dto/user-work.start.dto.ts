import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UserWorkStartDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsNotEmpty()
  sequenceNumber: number;
}
