import moment = require('moment');
import { EntityRepository, Repository } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { UserWork } from './user-work.entity';

@EntityRepository(UserWork)
export class UserWorkRepository extends Repository<UserWork> {
  public async findAllByUser(user: User): Promise<UserWork[]> {
    const entities = await this.find({
      order: { startAt: 'DESC' },
      relations: ['task', 'task.project'],
      where: { user },
    });
    return entities.map(this.prepare);
  }

  public async startTask(task: Task, user: User, userWorkData: Partial<UserWork>): Promise<UserWork> {
    const userWork = this.create({
      ...userWorkData,
      startAt: moment(),
      task,
      user,
    });
    return this.prepare(await this.save(userWork));
  }

  public async finishTask(userWork: UserWork): Promise<UserWork> {
    userWork.finishAt = moment();
    return await this.save(userWork);
  }

  private prepare(userWork: UserWork): UserWork {
    const projectId = userWork.projectId;
    const taskId = userWork.taskId;
    const taskTypeId = userWork.taskTypeId;
    delete userWork.task;
    delete userWork.taskType;
    return { ...userWork, projectId, taskId, taskTypeId };
  }
}
