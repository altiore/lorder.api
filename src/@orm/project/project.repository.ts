import { omit } from 'lodash';
import { EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { ProjectFieldsEnum } from '../../project/@dto';
import { TaskType } from '../task-type/task-type.entity';
import { UserProject } from '../user-project/user-project.entity';
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

  public async findOneByUser(projectId: number, user: User): Promise<Project> {
    const entity = await this.createQueryBuilder()
      .leftJoinAndMapMany('Project.projectTaskTypes', 'Project.projectTaskTypes', 'projectTaskTypes')
      .leftJoinAndMapOne(
        'projectTaskTypes.taskType',
        TaskType,
        'taskTypes',
        '"projectTaskTypes"."taskTypeId"="taskTypes"."id"'
      )
      .leftJoinAndMapMany('Project.members', 'Project.members', 'projectMembers')
      .leftJoinAndMapOne('projectMembers.member', 'user', 'users', '"projectMembers"."memberId"="users"."id"')
      .leftJoinAndMapMany('users.roles', 'user_roles', 'user_roles', '"users"."id"="user_roles"."userId"')
      .leftJoinAndMapMany('users.roles', 'role', 'roles', '"roles"."id"="user_roles"."roleId"')
      .innerJoinAndMapOne(
        'Project.accessLevel',
        UserProject,
        'accessLevel',
        '"accessLevel"."memberId" = :memberId AND "accessLevel"."projectId" = "Project"."id"',
        { memberId: user.id }
      )
      .where('"Project"."id" = :projectId', { projectId })
      .orderBy({
        '"projectTaskTypes"."order"': 'ASC',
      })
      .getOne();
    return this.prepare(entity);
  }

  public async findOneBySuperAdmin(id: number): Promise<Project> {
    const entity = await this.findOneOrFail({
      relations: ['tasks', 'projectTaskTypes', 'members'],
      where: { id },
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
    return omit<Project>(project, ['projectTaskTypes', 'members', 'tasks', 'creator', 'updator']);
  }

  public prepare(project: Project): Project {
    if (project.taskTypes) {
      delete project.projectTaskTypes;
    }
    return project;
  }

  public async findAllWithPagination(
    { skip = 0, count = 20, orderBy = ProjectFieldsEnum.createdAt, order = 'desc' }: PaginationDto,
    user: User
  ): Promise<Partial<Project>[]> {
    const entities = await this.createQueryBuilder()
      .leftJoinAndMapOne(
        'Project.accessLevel',
        'Project.members',
        'accessLevel',
        '"accessLevel"."memberId" = :memberId',
        { memberId: user.id }
      )
      .skip(skip)
      .limit(count)
      .orderBy(`Project.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .getMany();
    return entities.map(this.preparePublic);
  }

  public async findWithPaginationByUser(
    { skip = 0, count = 20, orderBy = ProjectFieldsEnum.createdAt, order = 'desc' }: PaginationDto,
    user: User
  ): Promise<Partial<Project>[]> {
    const entities = await this.createQueryBuilder()
      .innerJoinAndMapOne(
        'Project.accessLevel',
        'Project.members',
        'accessLevel',
        '"accessLevel"."memberId" = :memberId',
        { memberId: user.id }
      )
      .skip(skip)
      .limit(count)
      .orderBy(`Project.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .getMany();
    return entities.map(this.preparePublic);
  }
}
