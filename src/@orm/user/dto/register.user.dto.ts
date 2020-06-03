import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly reCaptcha?: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public readonly password: string;
}
