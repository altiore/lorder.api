import { ApiProperty } from '@nestjs/swagger';

import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class BulkDeleteRoleDto {
  @ApiProperty({ isArray: true, type: Number })
  @IsNumber(undefined, { each: true })
  @IsArray()
  @ArrayMinSize(1)
  public readonly ids: number[];
}
