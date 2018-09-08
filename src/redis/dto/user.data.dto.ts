import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDataDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;

  @ApiModelPropertyOptional()
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional()
  public readonly password?: string;
}
