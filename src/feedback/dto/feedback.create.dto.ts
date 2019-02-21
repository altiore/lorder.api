import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class FeedbackCreateDto {
  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiModelProperty()
  @IsEmail()
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiModelProperty()
  @MinLength(2)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiModelProperty()
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
