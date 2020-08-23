import { DeepPartial, EntityManager, EntityRepository, MoreThanOrEqual, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto';
import { Project } from '../entities/project.entity';
import { ACCESS_LEVEL } from '../entities/user-project.entity';
import { UserProject } from '../entities/user-project.entity';
import { User } from '../entities/user.entity';

@EntityRepository(UserProject)
export class UserProjectRepository extends Repository<UserProject> {
  public async addToProject(
    project: DeepPartial<Project>,
    member: User,
    inviter: User,
    accessLevel: number = ACCESS_LEVEL.WHITE,
    manager?: EntityManager
  ): Promise<UserProject> {
    const curManager = manager || this.manager;
    const entity = curManager.create(UserProject, {
      accessLevel,
      inviter,
      member,
      project,
    });
    return await curManager.save(entity);
  }

  public async activateInProject(member: User, project: DeepPartial<Project>): Promise<UserProject> {
    const entity = await this.findOneOrFail({
      where: { member, project },
    });
    entity.project = project as Project;
    if (entity.accessLevel >= ACCESS_LEVEL.RED) {
      return entity;
    }
    entity.accessLevel = ACCESS_LEVEL.RED;
    return await this.save(entity);
  }

  public findWithStatistic(project: Project): Promise<UserProject[]> {
    return this.find({
      relations: ['member', 'member.works'],
      where: { project },
    });
  }

  public async findAllParticipantProjects(
    { skip = 0, count = 20 }: PaginationDto,
    user: User,
    minimumAccessLevel: ACCESS_LEVEL = ACCESS_LEVEL.WHITE
  ): Promise<UserProject[]> {
    return await this.find({
      loadEagerRelations: false,
      relations: [
        'project',
        'project.pub',
        'project.projectTaskTypes',
        'project.projectTaskTypes.taskType',
        'roles',
        'roles.role',
      ],
      skip,
      take: count,
      where: {
        accessLevel: MoreThanOrEqual(minimumAccessLevel),
        member: user,
      },
    });
  }
}
