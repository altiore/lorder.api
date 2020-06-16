import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Feedback, FeedbackRepository } from '@orm/feedback';

import { PaginationDto } from '../@common/dto/pagination.dto';
import { UserService } from '../user/user.service';
import { FeedbackCreateDto } from './dto';

@Injectable()
export class FeedbackService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(FeedbackRepository) private readonly feedbackRepo: FeedbackRepository
  ) {}

  public async create(data: FeedbackCreateDto): Promise<Feedback> {
    if (data.userId) {
      const user = await this.userService.findOne(data.userId);
      if (!user) {
        data.userId = undefined;
      }
    }
    const feedback = this.feedbackRepo.create(data);
    return await this.feedbackRepo.save(feedback);
  }

  public async all(paginationDto: PaginationDto): Promise<Feedback[]> {
    return this.feedbackRepo.findAllWithPagination(paginationDto);
  }
}
