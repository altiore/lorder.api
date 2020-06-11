import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto<Entity = {}> {
  @ApiProperty()
  public readonly count: number;

  @ApiProperty()
  public readonly page: number;

  @ApiProperty()
  public readonly pageCount: number;

  @ApiProperty()
  public readonly total: number;

  @ApiProperty({ isArray: true, type: Object })
  public readonly data: Entity[];
}
