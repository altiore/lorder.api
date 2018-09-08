import { EntityRepository, Repository } from 'typeorm';

import { ProjectTaskType } from '../project-task-type/project-task-type.entity';
import { User } from '../user/user.entity';
import { ProjectDto } from './dto';
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  public findAllByOwner(owner: User): Promise<Project[]> {
    return this.find({
      loadRelationIds: true,
      relations: ['owner'],
      where: { owner },
    });
  }

  public findOneByOwner(id: number, owner: User): Promise<Project> {
    return this.findOneOrFail({
      loadRelationIds: true,
      relations: ['owner'],
      where: { id, owner },
    });
  }

  public createByUser(data: ProjectDto, creator: User): Promise<Project> {
    const project = this.create(data);
    project.creator = creator;
    project.updator = creator;
    project.owner = creator;
    return this.save(project);
  }

  public replaceTaskTypes(project: Project, projectTaskTypes: ProjectTaskType[]) {
    project.projectTaskTypes = projectTaskTypes;
    return this.save(project);
  }
}
