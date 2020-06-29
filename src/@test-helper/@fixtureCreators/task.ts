import { fixtureCreator, many, one } from 'typeorm-fixtures';

import { company, random } from 'faker';

import { STATUS_NAME } from '../../@domains/strategy';
import { Project } from '../../@orm/project';
import { Task } from '../../@orm/task';
import { User } from '../../@orm/user';
import { UserTask } from '../../@orm/user-task';

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
