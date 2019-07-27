import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { StatisticsResponse } from './dto';
import { StatisticsService } from './statistics.service';

@ApiBearerAuth()
@ApiUseTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly taskService: StatisticsService) {}

  @Get()
  @ApiResponse({ status: 200, type: StatisticsResponse })
  public progress(): Promise<StatisticsResponse> {
    return this.taskService.progress();
  }
}
