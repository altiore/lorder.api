import { EntityRepository, TreeRepository } from 'typeorm';

import { TaskLog } from './task-log.entity';

@EntityRepository(TaskLog)
export class TaskLogRepository extends TreeRepository<TaskLog> {

}
