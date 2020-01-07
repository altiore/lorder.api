import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class FeedbackCreateDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsEmail()
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
