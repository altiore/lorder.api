import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiModelPropertyOptional()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly email: string;

  @ApiModelPropertyOptional()
  @Length(12, 24)
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public readonly tel: string;
}
