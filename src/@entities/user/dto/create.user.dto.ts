import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  public readonly identifier: string;

  @ApiModelPropertyOptional()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly email?: string;
}
