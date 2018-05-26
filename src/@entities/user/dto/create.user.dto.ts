import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  public readonly identifier: string;
}