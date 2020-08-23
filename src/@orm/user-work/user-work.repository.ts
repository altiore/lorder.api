import moment = require('moment');
import { Moment } from 'moment';
import { EntityManager, EntityRepository, IsNull, Repository, SelectQueryBuilder } from 'typeorm';

import { DATE_FORMAT } from '../../@common/consts';
import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Task } from '../entities/task.entity';
import { UserWork } from '../entities/user-work.entity';
import { User } from '../entities/user.entity';

@EntityRepository(UserWork)
export class UserWorkRepository extends Repository<UserWork> {
  public async findOneByUser(userWorkId: number, user: User): Promise<UserWork> {
    return this.findOne({
      relations: ['task', 'task.project'],
      where: { id: userWorkId, user },
    });
  }

  public async findAllWithPagination(
    { skip = 0, count = 20, orderBy = 'startAt', order = 'desc' }: PaginationDto,
    user: User
  ): Promise<UserWork[]> {
    const entities = await this.find({
      order: { [orderBy]: order.toUpperCase() },
      relations: ['task'],
      skip,
      take: count,
      where: { user, task: { isArchived: false } },
    });
    return entities.map(this.prepare);
  }

  public async startTask(
    task: Task,
    user: User,
    userWorkData: Partial<UserWork>,
    startAt: Moment,
    manager?: EntityManager
  ): Promise<UserWork> {
    const curManager = manager || this.manager;
    const userWork = curManager.create(UserWork, {
      ...userWorkData,
      startAt: startAt || moment(),
      task,
      user,
    });
    userWork.task = task;
    return this.prepare(await curManager.save(userWork));
  }

  public async findWithPaginationByUser(
    user: User,
    { count = 8, skip = 0, orderBy = 'startAt', order = 'desc' }: PaginationDto
  ): Promise<UserWork[]> {
    const entities = await this.find({
      order: { [orderBy]: order.toUpperCase() },
      relations: ['task', 'task.userTasks', 'prevTask'],
      skip,
      take: count,
      where: { user },
    });
    return entities.map(this.prepare);
  }

  public async findNotFinishedByUser(user: User): Promise<UserWork[]> {
    const entities = await this.find({
      relations: ['task', 'task.userTasks'],
      where: { finishAt: IsNull(), user },
    });
    return entities.map(this.prepare);
  }

  public async findAllTouchedBetween(
    changedUserWork: UserWork,
    user: User,
    startAt: moment.Moment,
    finishAt?: moment.Moment
  ): Promise<UserWork[]> {
    let query: SelectQueryBuilder<UserWork>;
    if (finishAt) {
      query = this.createQueryBuilder().orWhere(
        `UserWork.id != :id AND UserWork.userId = :userId AND UserWork.startAt BETWEEN :start AND :finish`,
        {
          finish: finishAt.format(DATE_FORMAT),
          id: changedUserWork.id,
          start: startAt.format(DATE_FORMAT),
          userId: user.id,
        }
      );
      query.orWhere(
        `UserWork.id != :id AND UserWork.userId = :userId AND UserWork.finishAt BETWEEN :start AND :finish`,
        {
          finish: finishAt.format(DATE_FORMAT),
          id: changedUserWork.id,
          start: startAt.format(DATE_FORMAT),
          userId: user.id,
        }
      );
    } else {
      query = this.createQueryBuilder().orWhere(
        `UserWork.id != :id AND UserWork.userId = :userId AND UserWork.startAt BETWEEN :start AND :finish`,
        {
          finish: moment().format(DATE_FORMAT),
          id: changedUserWork.id,
          start: startAt.format(DATE_FORMAT),
          userId: user.id,
        }
      );
      query.orWhere(
        `UserWork.id != :id AND UserWork.userId = :userId AND UserWork.finishAt BETWEEN :start AND :finish`,
        {
          finish: moment().format(DATE_FORMAT),
          id: changedUserWork.id,
          start: startAt.format(DATE_FORMAT),
          userId: user.id,
        }
      );
    }

    return query.getMany();
  }

  private prepare(userWork: UserWork): UserWork {
    const projectId = userWork.projectId;
    const prevProjectId = userWork.prevProjectId;
    return { ...userWork, prevProjectId, projectId };
  }
}
