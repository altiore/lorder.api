import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean, IsOptional } from 'class-validator';

export class ProjectRoleUpdateDto {
  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isPublic!: boolean;
}
