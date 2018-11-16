import moment = require('moment');
import { Moment } from 'moment';
import { EntityRepository, IsNull, Raw, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { UserWork } from './user-work.entity';

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
      where: { user },
    });
    return entities.map(this.prepare);
  }

  public async startTask(task: Task, user: User, userWorkData: Partial<UserWork>, startAt: Moment): Promise<UserWork> {
    const userWork = this.create({
      ...userWorkData,
      startAt: startAt || moment(),
      task,
      user,
    });
    return this.prepare(await this.save(userWork));
  }

  finishTask(userWork: UserWork): Promise<UserWork>;
  finishTask(userWork: UserWork[]): Promise<UserWork[]>;
  public async finishTask(userWork) {
    if (Array.isArray(userWork)) {
      userWork.forEach(el => (el.finishAt = moment()));
      return await this.save(userWork);
    } else {
      userWork.finishAt = moment();
      return await this.save(userWork);
    }
  }

  public async lastXHoursInfo(user: User, hours: 1 | 12 | 24 | 48 = 24): Promise<UserWork[]> {
    const allowedHours = {
      1: '1',
      12: '12',
      24: '24',
      48: '48',
    };
    if (!allowedHours[hours]) {
      throw new Error(`Only hours ${Object.keys(allowedHours).join(',')} allowed!`);
    }
    const entities = await this.find({
      order: { startAt: 'DESC' },
      relations: ['task'],
      where: {
        startAt: Raw(alias => `${alias} > (NOW() - INTERVAL '${allowedHours[hours]} HOURS')`),
        user,
      },
    });
    return entities.map(this.prepare);
  }

  public async findNotFinishedByUser(user: User): Promise<UserWork[]> {
    const entities = await this.find({
      relations: ['task'],
      where: { finishAt: IsNull(), user },
    });
    return entities.map(this.prepare);
  }

  private prepare(userWork: UserWork): UserWork {
    const projectId = userWork.projectId;
    // delete userWork.task;
    return { ...userWork, projectId };
  }
}
