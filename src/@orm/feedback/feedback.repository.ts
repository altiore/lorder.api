import { EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Feedback } from './feedback.entity';

@EntityRepository(Feedback)
export class FeedbackRepository extends Repository<Feedback> {
  public async findAllWithPagination({
    skip = 0,
    count = 20,
    orderBy = 'id',
    order = 'desc',
  }: PaginationDto): Promise<Feedback[]> {
    return this.find({
      order: {
        [orderBy]: order.toUpperCase(),
      },
      skip,
      take: count,
    });
  }
}
