import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class UserWorkUpdateDto {
  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiModelPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;
}
