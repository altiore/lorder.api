import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
