import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly username: string;

  @ApiModelPropertyOptional()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly email?: string;
}
