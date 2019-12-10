import { DeepPartial, EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';
import { ACCESS_LEVEL } from './user-project.consts';
import { UserProject } from './user-project.entity';

@EntityRepository(UserProject)
export class UserProjectRepository extends Repository<UserProject> {
  public async addToProject(
    project: DeepPartial<Project>,
    member: User,
    inviter: User,
    accessLevel: number = ACCESS_LEVEL.WHITE
  ): Promise<UserProject> {
    const entity = this.create({
      accessLevel,
      inviter,
      member,
      project,
    });
    return await this.save(entity);
  }

  public async activateInProject(
    member: User,
    project: DeepPartial<Project>
  ): Promise<UserProject> {
    const entity = await this.findOneOrFail({
      where: { member, project },
    });
    if (entity.accessLevel >= ACCESS_LEVEL.RED) {
      return entity;
    }
    entity.accessLevel = ACCESS_LEVEL.RED;
    entity.project = project as Project;
    return await this.save(entity);
  }

  public findWithStatistic(project: Project): Promise<UserProject[]> {
    return this.find({
      relations: ['member', 'member.works'],
      where: { project },
    });
  }

  public async findAllOwnProjects(
    { skip = 0, count = 20 }: PaginationDto,
    user: User
  ): Promise<UserProject[]> {
    return await this.find({
      loadEagerRelations: false,
      relations: ['project'],
      skip,
      take: count,
      where: {
        member: user,
      },
    });
  }
}
