import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { toArray } from 'lodash';

import { PaginationDto } from '../../@common/dto/pagination.dto';

export enum ProjectFieldsEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
}

export class ProjectPaginationDto extends PaginationDto<ProjectFieldsEnum> {
  @ApiModelPropertyOptional()
  @IsString()
  @IsIn(toArray(ProjectFieldsEnum))
  @IsOptional()
  public readonly orderBy?: ProjectFieldsEnum;
}
