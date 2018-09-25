import { omit } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { ProjectFieldsEnum } from '../../project/dto';
import { User } from '../user/user.entity';
import { ProjectDto } from './dto';
import { Project } from './project.entity';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
  public async findAllByOwner(owner: User): Promise<Partial<Project>[]> {
    const entities = await this.find({
      loadRelationIds: true,
      relations: ['owner'],
      where: { owner },
    });
    return entities.map(this.preparePublic);
  }

  public async findOneByOwner(id: number, owner: User): Promise<Partial<Project>> {
    const entity = await this.findOneOrFail({
      relations: ['owner', 'tasks', 'projectTaskTypes', 'projectMembers'],
      where: { id, owner },
    });
    return this.prepare(entity);
  }

  public createByUser(data: ProjectDto, creator: User): Promise<Project> {
    const project = this.create(data);
    project.creator = creator;
    project.updator = creator;
    project.owner = creator;
    return this.save(project);
  }

  public preparePublic(project: Project): Partial<Project> {
    return omit<Project>(project, ['projectTaskTypes', 'projectMembers', 'tasks', 'creator', 'updator']);
  }

  public prepare(project: Project): Partial<Partial<Project>> {
    return {
      ...omit<Project>(project, ['projectTaskTypes', 'projectMembers']),
      members: project.members,
      taskTypes: project.taskTypes,
    };
  }

  public async findWithPagination(
    { skip = 0, count = 20, orderBy = ProjectFieldsEnum.createdAt, order = 'desc' }: PaginationDto,
    user: User
  ): Promise<Partial<Project>[]> {
    const entities = await this.find({
      join: {
        alias: 'projectMembers',
        innerJoinAndSelect: {
          'projectMembers.id': 'projectMemberId',
        },
      },
      order: { [orderBy]: order.toUpperCase() },
      skip,
      take: count,
    });
    return entities.map(this.preparePublic);
  }
}
