import { ApiModelProperty } from '@nestjs/swagger';

export class ListResponseDto<Entity = {}> {
  @ApiModelProperty()
  public readonly total: number;

  @ApiModelProperty({ isArray: true, type: Object })
  public readonly list: Entity[];
}
