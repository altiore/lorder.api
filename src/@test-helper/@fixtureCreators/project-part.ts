import { fixtureCreator, one } from 'typeorm-fixtures';

import { ProjectPart } from '@orm/entities/project-part.entity';
import { Project } from '@orm/entities/project.entity';

import { company } from 'faker';

export const createProjectParts = fixtureCreator<ProjectPart>(ProjectPart, function (entity, index) {
  return {
    title: `${company.companyName()} ${index}`,
    ...entity,
    project: one(this, Project, entity.project),
    // parent: one(this, ProjectPart, entity.parent),
    // children: many(this, ProjectPart, entity.children),
  };
});
