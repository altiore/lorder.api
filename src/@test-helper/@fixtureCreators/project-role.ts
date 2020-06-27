import { fixtureCreator, many, one } from 'typeorm-fixtures';

import { company } from 'faker';

import { Project } from '../../@orm/project';
import { ProjectRoleAllowedMove } from '../../@orm/project-role-allowed-move/project-role-allowed-move.entity';
import { ProjectRole } from '../../@orm/project-role/project-role.entity';
import { RoleFlow } from '../../@orm/role-flow';

export const createProjectRoles = fixtureCreator<ProjectRole>(ProjectRole, function (entity, index) {
  return {
    name: `${company.companyName()} ${index}`,
    ...entity,
    role: one(this, RoleFlow, entity.role),
    project: one(this, Project, entity.project),
    allowedMoves: many(this, ProjectRoleAllowedMove, entity.allowedMoves),
  };
});
