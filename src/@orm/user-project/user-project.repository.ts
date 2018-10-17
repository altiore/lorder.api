import { EntityRepository, Repository } from 'typeorm';

import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { ACCESS_LEVEL } from './user-project.consts';
import { UserProject } from './user-project.entity';

@EntityRepository(UserProject)
export class UserProjectRepository extends Repository<UserProject> {
  public async addToProject(
    project: Project,
    member: User,
    inviter: User,
    accessLevel: number = ACCESS_LEVEL.RED,
    status: number = UserProject.INVITED_STATUS
  ): Promise<UserProject> {
    const entity = this.create({
      accessLevel,
      inviter,
      member,
      project,
      status,
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
