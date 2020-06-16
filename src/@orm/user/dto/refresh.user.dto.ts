import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly refreshToken: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public readonly device: string;
}
