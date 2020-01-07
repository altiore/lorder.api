import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StatisticsResponse {
  @ApiProperty()
  public readonly activeProjectsCount: number;

  @ApiProperty()
  public readonly activeUsersCount: number;

  @ApiProperty()
  public readonly activity: number;

  @ApiProperty()
  public readonly publicProjectsCount: number;
}
