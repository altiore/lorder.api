// import { company, random } from 'faker';
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Project } from '../../@orm/project';
import { User } from '../../@orm/user';
import { ACCESS_LEVEL, UserProject } from '../../@orm/user-project';

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
