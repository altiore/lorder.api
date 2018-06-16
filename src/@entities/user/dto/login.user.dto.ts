import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @ApiModelProperty()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  public readonly password: string;
}
