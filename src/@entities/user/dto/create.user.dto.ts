import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly email: string;

  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly resetLink: string;
}
