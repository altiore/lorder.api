import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class TaskTypeCreateDto {
  @ApiProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  name: string;
}
