import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TaskMoveDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;
}
