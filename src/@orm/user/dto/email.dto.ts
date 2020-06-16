import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  public readonly reCaptcha?: string;

  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
