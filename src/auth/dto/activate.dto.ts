import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from 'class-validator';

export class ActivateDto {
  @ApiModelProperty()
  @IsString()
  @IsNotEmpty()
  public readonly oneTimeToken: string;

  @ApiModelPropertyOptional()
  @IsNumberString()
  @IsOptional()
  public readonly project?: string;
}
