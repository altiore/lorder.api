import { company, random } from 'faker';
import { fixtureCreator, one } from 'typeorm-fixtures';

import { Project } from '../../src/@orm/project';
import { User } from '../../src/@orm/user';
import { ACCESS_LEVEL, UserProject } from '../../src/@orm/user-project';

export const createUserProjects = fixtureCreator<UserProject>(UserProject, function(entity, index) {
  return {
    accessLevel: ACCESS_LEVEL.RED,
    inviter: one(this, User, entity.inviter),
    member: one(this, User, entity.member),
    project: one(this, Project, entity.project),
    status: 0,
  };
});
