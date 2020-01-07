import { ApiProperty } from '@nestjs/swagger';
import {
  IsHexColor,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class TaskTypeCreateDto {
  @ApiProperty()
  @MaxLength(40)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @MaxLength(12)
  @MinLength(3)
  @IsString()
  @IsOptional()
  icon: string;

  @ApiProperty()
  @IsHexColor()
  @IsOptional()
  color: string;
}
