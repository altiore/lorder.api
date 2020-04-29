import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserWorkCreateDto {
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  performerId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  projectId: number;

  @ApiProperty()
  @MaxLength(140)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(3)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  taskId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  prevTaskId?: number;
}
