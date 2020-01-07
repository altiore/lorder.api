import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

import { ACCESS_LEVEL } from '../../../@orm/user-project';

export class UserProjectUpdateDto {
  @ApiProperty()
  @Max(ACCESS_LEVEL.INDIGO)
  @Min(ACCESS_LEVEL.RED)
  @IsInt()
  @IsNumber()
  @IsNotEmpty()
  public readonly accessLevel: number;
}
