import { ApiProperty } from '@nestjs/swagger';

import { IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { ACCESS_LEVEL } from '@orm/entities/user-project.entity';

export class UserProjectUpdateDto {
  @ApiProperty()
  @Max(ACCESS_LEVEL.INDIGO)
  @Min(ACCESS_LEVEL.WHITE)
  @IsInt()
  @IsNumber()
  @IsOptional()
  public readonly accessLevel?: number;

  @ApiProperty({ isArray: true, type: String })
  @IsString({ each: true })
  @IsOptional()
  public readonly roles?: string[];
}
