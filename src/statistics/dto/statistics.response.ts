import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class StatisticsResponse {
  @ApiModelProperty()
  public readonly activeProjectsCount: number;

  @ApiModelProperty()
  public readonly activeUsersCount: number;

  @ApiModelProperty()
  public readonly activity: number;

  @ApiModelProperty()
  public readonly publicProjectsCount: number;
}
