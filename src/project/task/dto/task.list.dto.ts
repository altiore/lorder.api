import { ApiProperty } from '@nestjs/swagger';

import { ListResponseDto } from '../../../@common/dto';
import { Task } from '../../../@orm/task';

class Column {}

export class TaskListDto extends ListResponseDto<Task> {
  @ApiProperty({ isArray: true, type: Column })
  columns: Column[];
}
