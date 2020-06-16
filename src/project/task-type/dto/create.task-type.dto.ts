import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTaskTypeDto {
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  @MinLength(3)
  @IsNotEmpty()
  name: string;
}
