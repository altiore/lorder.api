import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class IdDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public readonly id: number;
}
