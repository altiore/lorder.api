import moment = require('moment');
import { EntityRepository, Repository } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { UserTask } from './user-task.entity';

@EntityRepository(UserTask)
export class UserTaskRepository extends Repository<UserTask> {
  public findAllByUser(user: User): Promise<UserTask[]> {
    return this.find({ order: { startAt: 'DESC' }, where: { user } });
  }

  public async startTask(task: Task, user: User, userTaskData: Partial<UserTask>): Promise<UserTask> {
    const userTask = this.create({
      ...userTaskData,
      startAt: moment(),
      task,
      user,
    });
    return await this.save(userTask);
  }

  public finishTask(userTask: UserTask): Promise<UserTask> {
    userTask.finishAt = moment();
    return this.save(userTask);
  }
}
