import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  ArrayMinSize,
  IsBoolean,
  IsInt,
  IsLowercase,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ProjectRoleCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsLowercase()
  @Matches(/^[a-z][a-z0-9\-_]{3,19}$/)
  @Length(3, 20)
  roleId: string;

  @ApiProperty({ isArray: true, type: Number })
  @IsNotEmpty()
  @ArrayMinSize(0)
  @IsNotEmpty({ each: true })
  @IsNumber(undefined, { each: true })
  @IsInt({ each: true })
  allowedMoveIds?: number[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;
}
