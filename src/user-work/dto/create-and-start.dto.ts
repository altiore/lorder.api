import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAndStartDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;
}
