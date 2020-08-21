import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RevertBackDto {
  @ApiPropertyOptional()
  @IsString()
  @MinLength(7)
  @IsNotEmpty()
  reason: string;
}
