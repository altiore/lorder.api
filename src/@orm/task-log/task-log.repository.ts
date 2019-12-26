import { EntityRepository, TreeRepository } from 'typeorm';

import { Task } from '../task/task.entity';
import { User } from '../user/user.entity';
import { TASK_CHANGE_TYPE, TaskLog } from './task-log.entity';

@EntityRepository(TaskLog)
export class TaskLogRepository extends TreeRepository<TaskLog> {
  public createTaskLogByType(
    taskChangeType: TASK_CHANGE_TYPE,
    task: Task,
    performer: User,
    prevVersion?: Partial<Task>
  ): TaskLog {
    return this.create({
      changeType: taskChangeType,
      createdBy: performer,
      prevVersion: prevVersion || task,
      task,
    });
  }
}
