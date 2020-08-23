import { fixtureCreator, many, one } from 'typeorm-fixtures';

import { Project } from '@orm/entities/project.entity';
import { Task } from '@orm/entities/task.entity';
import { UserTask } from '@orm/entities/user-task.entity';
import { User } from '@orm/entities/user.entity';

import { company, random } from 'faker';

import { STATUS_NAME } from '../../@domains/strategy';

export const createTasks = fixtureCreator<Task>(Task, function (entity, index) {
  return {
    description: random.words(5),
    inProgress: false,
    sequenceNumber: index,
    status: 1,
    statusTypeName: STATUS_NAME.READY_TO_DO,
    title: company.companyName(),
    value: random.number(100),
    ...entity,
    performer: entity.performer ? one(this, User, entity.performer) : undefined,
    project: one(this, Project, entity.project),
    userTasks: many(this, UserTask, entity.userTasks),
  };
});
