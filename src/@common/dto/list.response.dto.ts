import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto<Entity = {}> {
  @ApiProperty()
  public readonly total: number;

  @ApiProperty({ isArray: true, type: Object })
  public readonly list: Entity[];
}
