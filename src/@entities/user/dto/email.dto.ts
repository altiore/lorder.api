import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class EmailDto {
  @ApiModelProperty()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  public readonly email: string;
}
