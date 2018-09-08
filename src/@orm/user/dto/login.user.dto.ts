import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public readonly password: string;
}
