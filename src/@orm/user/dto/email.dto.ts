import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
