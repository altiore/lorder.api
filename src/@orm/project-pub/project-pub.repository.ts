import { NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Project } from '../project/project.entity';

import { ProjectPub } from './project-pub.entity';

@EntityRepository(ProjectPub)
export class ProjectPubRepository extends Repository<ProjectPub> {
  public async findPublishedByUuid(uuid: string): Promise<ProjectPub> {
    const pubProject = await this.findOneOrFail({
      relations: ['project', 'project.members'],
      where: { uuid },
    });
    if (pubProject.members) {
      return pubProject;
    }

    throw new NotFoundException('Public project doesn\'t contain members!');
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
