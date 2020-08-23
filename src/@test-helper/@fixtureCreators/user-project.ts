// import { company, random } from 'faker';
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Project } from '@orm/entities/project.entity';
import { ACCESS_LEVEL, UserProject } from '@orm/entities/user-project.entity';
import { User } from '@orm/entities/user.entity';

export const createUserProjects = fixtureCreator<UserProject>(UserProject, function (entity, index) {
  return {
    accessLevel: ACCESS_LEVEL.WHITE,
    timeSum: 0,
    valueSum: 0,
    ...entity,
    inviter: one(this, User, entity.inviter),
    member: one(this, User, entity.member),
    project: one(this, Project, entity.project),
  };
});
