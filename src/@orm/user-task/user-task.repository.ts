import { EntityRepository, Repository } from 'typeorm';

import { UserTask } from './user-task.entity';

@EntityRepository(UserTask)
export class UserTaskRepository extends Repository<UserTask> {}
