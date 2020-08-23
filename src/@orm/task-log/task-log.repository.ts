import { omit } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';

import { TaskLog, TASK_CHANGE_TYPE } from '../entities/task-log.entity';
import { Task } from '../entities/task.entity';
import { User } from '../entities/user.entity';

@EntityRepository(TaskLog)
export class TaskLogRepository extends Repository<TaskLog> {
  public createTaskLogByType(
    taskChangeType: TASK_CHANGE_TYPE,
    task: Task,
    performer: User,
    prevVersion?: Partial<Task>
  ): TaskLog {
    return this.create({
      changeType: taskChangeType,
      createdBy: performer,
      prevVersion: omit(prevVersion || task, [
        'createdBy',
        'performer',
        'userWorks',
        'userTasks',
        'parentTask',
        'project',
        'projectPart',
        'children',
      ]),
      task,
    });
  }
}
