import { fixtureCreator, many, one } from 'typeorm-fixtures';

import { company, random } from 'faker';

import { Project } from '../../@orm/project';
import { Task, TASK_SIMPLE_STATUS } from '../../@orm/task';
import { STATUS_NAME } from '../../@orm/task-status/task-status.entity';
import { User } from '../../@orm/user';
import { UserTask } from '../../@orm/user-task';

export const createTasks = fixtureCreator<Task>(Task, function(entity, index) {
  return {
    description: random.words(5),
    sequenceNumber: index,
    status: TASK_SIMPLE_STATUS.JUST_CREATED,
    statusTypeName: STATUS_NAME.IN_PROGRESS,
    title: company.companyName(),
    value: random.number(100),
    ...entity,
    performer: entity.performer ? one(this, User, entity.performer) : undefined,
    project: one(this, Project, entity.project),
    userTasks: many(this, UserTask, entity.userTasks),
  };
});
