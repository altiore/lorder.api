import { EntityRepository, Repository } from 'typeorm';

import { Project } from '../project/project.entity';
import { ProjectPub } from './project-pub.entity';

@EntityRepository(ProjectPub)
export class ProjectPubRepository extends Repository<ProjectPub> {
  public findPublishedByUuid(uuid: string): Promise<ProjectPub> {
    return this.findOneOrFail({
      where: { uuid },
    });
  }

  public findPublishedByProject(project: Project): Promise<ProjectPub | undefined> {
    return this.findOne({ project });
  }

  public publishNew(project: Project): Promise<ProjectPub> {
    const entity = this.create({
      isOpen: true,
      project,
      title: project.title,
    });
    return this.save(entity);
  }
}
