import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../@common/decorators';
import { PaginationDto } from '../@common/dto/pagination.dto';
import { RolesGuard } from '../@common/guards';
import { Feedback } from '../@orm/feedback';
import { FeedbackCreateDto } from './dto';
import { FeedbackService } from './feedback.service';

@ApiBearerAuth()
@ApiTags('feedback')
@Controller('feedback')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @ApiResponse({ description: 'Создать обратную связь', status: 201, type: Feedback })
  @Roles('user')
  @Post()
  public async create(@Body() data: FeedbackCreateDto): Promise<Feedback> {
    return await this.feedbackService.create(data);
  }

  @ApiResponse({
    description: 'Возвращает обратную связь',
    isArray: true,
    status: 200,
    type: Feedback,
  })
  @Roles('super-admin')
  @Get()
  public async all(@Query() pagesDto: PaginationDto): Promise<Feedback[]> {
    return this.feedbackService.all(pagesDto);
  }
}
