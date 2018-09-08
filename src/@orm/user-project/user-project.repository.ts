import { EntityRepository, Repository } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { UserProject } from './user-project.entity';

@EntityRepository(UserProject)
export class UserProjectRepository extends Repository<UserProject> {
  public async addToProject(project: Project, member: User, inviter: User): Promise<UserProject> {
    const entity = this.create({
      accessLevel: 1,
      inviter,
      member,
      project,
      status: 0,
    });
    return await this.save(entity);
  }

  public async activateInProject(member: User, projectId: string): Promise<UserProject> {
    const project = { id: parseInt(projectId, 0) };
    const entity = await this.findOneOrFail({
      where: { member, project },
    });
    entity.status = 1;
    entity.project = project as Project;
    return await this.save(entity);
  }
}
