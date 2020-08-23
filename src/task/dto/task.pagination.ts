import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsIn, IsOptional, IsString } from 'class-validator';
import { toArray } from 'lodash';

import { TaskOrderByField } from '@orm/task/task.repository';

import { PaginationDto } from '../../@common/dto';

export class TaskPagination extends PaginationDto {
  @ApiPropertyOptional({ type: String })
  @IsString()
  @IsOptional()
  @IsIn(toArray(TaskOrderByField))
  public readonly orderBy?: TaskOrderByField;
}
