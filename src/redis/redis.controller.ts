import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'auth/guards/jwt-auth.guard';

import { Roles } from '../@common/decorators/roles.decorator';
import { RolesGuard } from '../@common/guards/roles.guard';

import { RedisService } from './redis.service';

@ApiBearerAuth()
@ApiTags('cache (super-admin)')
@Controller('cache')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @ApiResponse({ status: 200 })
  @Get('reset')
  @Roles('super-admin')
  public reset(): Promise<void> {
    return this.redisService.resetAll();
  }
}
