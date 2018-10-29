import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UserWorkUpdateDto {
  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  duration?: number;
}
