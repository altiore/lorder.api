import { fixtureCreator, one } from 'typeorm-fixtures';

import { company } from 'faker';

import { Project } from '../../@orm/project';
import { ProjectPart } from '../../@orm/project-part/project-part.entity';

export const createProjectParts = fixtureCreator<ProjectPart>(ProjectPart, function (entity, index) {
  return {
    title: `${company.companyName()} ${index}`,
    ...entity,
    project: one(this, Project, entity.project),
    // parent: one(this, ProjectPart, entity.parent),
    // children: many(this, ProjectPart, entity.children),
  };
});
