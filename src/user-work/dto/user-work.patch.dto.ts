import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Validate } from 'class-validator';

import { IsMomentString, LaterThenField, MomentMaxDate } from '../../@common/validators';

export class UserWorkPatchDto {
  @ApiModelPropertyOptional()
  @MaxLength(255)
  @IsString()
  @IsOptional()
  description?: string;

  @ApiModelPropertyOptional({ example: '2018-05-26T09:05:39.378Z' })
  @Validate(IsMomentString)
  @Validate(MomentMaxDate)
  @IsOptional()
  startAt?: string;

  @ApiModelPropertyOptional({ example: '2018-05-26T09:05:39.378Z' })
  @Validate(LaterThenField, ['startAt'])
  @Validate(MomentMaxDate)
  @Validate(IsMomentString)
  @IsOptional()
  finishAt?: string;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  value?: number;

  @ApiModelPropertyOptional()
  @MaxLength(255)
  @IsString()
  @IsOptional()
  source?: string;

  @ApiModelPropertyOptional()
  @IsNumber()
  @IsOptional()
  taskId?: number;

  // validated during check access
  @ApiModelProperty()
  @IsNotEmpty()
  projectId: number;
}
