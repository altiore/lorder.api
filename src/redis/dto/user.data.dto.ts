import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDataDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiPropertyOptional()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional()
  public readonly password?: string;
}
