import moment = require('moment');
import { EntityRepository, Repository } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { UserTask } from './user-task.entity';

@EntityRepository(UserTask)
export class UserTaskRepository extends Repository<UserTask> {
  public async findAllByUser(user: User): Promise<UserTask[]> {
    const entities = await this.find({
      order: { startAt: 'DESC' },
      relations: ['task', 'task.project'],
      where: { user },
    });
    return entities.map(this.prepare);
  }

  public async startTask(task: Task, user: User, userTaskData: Partial<UserTask>): Promise<UserTask> {
    const userTask = this.create({
      ...userTaskData,
      startAt: moment(),
      task,
      user,
    });
    return this.prepare(await this.save(userTask));
  }

  public async finishTask(userTask: UserTask): Promise<UserTask> {
    userTask.finishAt = moment();
    return await this.save(userTask);
  }

  private prepare(userTask: UserTask): UserTask {
    const projectId = userTask.projectId;
    const taskId = userTask.taskId;
    const taskTypeId = userTask.taskTypeId;
    delete userTask.task;
    delete userTask.taskType;
    return { ...userTask, projectId, taskId, taskTypeId };
  }
}
