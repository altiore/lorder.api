import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { toArray } from 'lodash';

import { PaginationDto } from '../../@common/dto/pagination.dto';

export enum TaskOrderByField {
  latest = 'latest',
  oldest = 'oldest',
}

export class TaskPagination extends PaginationDto {
  @ApiModelPropertyOptional({ type: String /*, enum: TaskOrderByField*/ })
  @IsString()
  @IsOptional()
  @IsIn(toArray(TaskOrderByField))
  public readonly orderBy?: TaskOrderByField;
}
