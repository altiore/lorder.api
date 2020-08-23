import { fixtureCreator, many, one } from 'typeorm-fixtures';

import { Project } from '@orm/entities/project.entity';

import { company } from 'faker';

import { ProjectRoleAllowedMove } from '../../@orm/entities/project-role-allowed-move.entity';
import { ProjectRole } from '../../@orm/entities/project-role.entity';
import { RoleFlow } from '../../@orm/entities/role-flow.entity';

export const createProjectRoles = fixtureCreator<ProjectRole>(ProjectRole, function (entity, index) {
  return {
    name: `${company.companyName()} ${index}`,
    ...entity,
    role: one(this, RoleFlow, entity.role),
    project: one(this, Project, entity.project),
    allowedMoves: many(this, ProjectRoleAllowedMove, entity.allowedMoves),
  };
});
