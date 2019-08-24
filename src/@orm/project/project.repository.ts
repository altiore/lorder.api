import { omit } from 'lodash';
import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { ProjectFieldsEnum } from '../../project/@dto';
import { ProjectPub } from '../project-pub/project-pub.entity';
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
      .leftJoinAndMapMany(
        'Project.projectTaskTypes',
        'Project.projectTaskTypes',
        'projectTaskTypes'
      )
      .leftJoinAndMapOne(
        'projectTaskTypes.taskType',
        TaskType,
        'taskTypes',
        '"projectTaskTypes"."taskTypeId"="taskTypes"."id"'
      )
      .leftJoinAndMapMany('Project.members', 'Project.members', 'projectMembers')
      .leftJoinAndMapOne(
        'projectMembers.member',
        'user',
        'users',
        '"projectMembers"."memberId"="users"."id"'
      )
      .leftJoinAndMapOne('users.avatar', 'media', 'medias', '"users"."avatarId"="medias"."id"')
      .leftJoinAndMapMany(
        'users.roles',
        'user_roles',
        'user_roles',
        '"users"."id"="user_roles"."userId"'
      )
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
    return omit<Project>(project, ['projectTaskTypes', 'members', 'creator', 'updator']);
  }

  public prepare(project: Project): Project {
    if (project.taskTypes) {
      delete project.projectTaskTypes;
    }
    (project.members as any) = project.members.map(({ accessLevel, member }) => ({
      accessLevel,
      member: {
        ...member,
        avatar: member.avatarUrl,
      },
    }));
    return project;
  }

  public async findAllWithPagination(
    paginationDto: PaginationDto,
    user: User
  ): Promise<Partial<Project>[]> {
    const entities = await this.selectOrderedProjects(
      paginationDto,
      this.createQueryBuilder().leftJoin(
        'Project.members',
        'AccessLevel',
        '"AccessLevel"."memberId" = :memberId',
        {
          memberId: user.id,
        }
      )
    );
    return entities.map(this.preparePublic);
  }

  public async findWithPaginationByUser(
    paginationDto: PaginationDto,
    user: User
  ): Promise<Partial<Project>[]> {
    const entities = await this.selectOrderedProjects(
      paginationDto,
      this.createQueryBuilder().innerJoin(
        'Project.members',
        'AccessLevel',
        '"AccessLevel"."memberId" = :memberId',
        {
          memberId: user.id,
        }
      )
    );
    return entities.map(this.preparePublic);
  }

  public findPublicById(id: number) {
    return this.findOneOrFail(id);
  }

  private async selectOrderedProjects(
    { skip = 0, count = 20, orderBy = ProjectFieldsEnum.createdAt, order = 'desc' }: PaginationDto,
    query: SelectQueryBuilder<Project>
  ): Promise<Project[]> {
    const rawArrayTimeSum = await query
      .clone()
      .select('"Project"."id"', 'id')
      .addSelect(
        'SUM(EXTRACT(EPOCH FROM ("ProjectWorks"."finishAt" - "ProjectWorks"."startAt")))',
        'timeSum'
      )
      .leftJoin('Project.tasks', 'ProjectTasks')
      .leftJoin('ProjectTasks.userWorks', 'ProjectWorks')
      .skip(skip)
      .limit(count)
      .orderBy(`Project.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .groupBy('Project.id')
      .getRawMany();
    console.log('selectOrderedProjects.rawArrayTimeSum', process.memoryUsage(), rawArrayTimeSum);
    // TODO: TWO similar queries here, because I do not know how to combine them
    // (if combine them than result has wrong `valueSum` value)
    const rawArray = await query
      .clone()
      .select('Project')
      .leftJoin('Project.tasks', 'ProjectTasks')
      .leftJoin('Project.pub', 'ProjectPub')
      // MAX here because of must use aggregation function for joined table user_project
      .addSelect('MAX("AccessLevel"."accessLevel")', 'Project_accessLevel')
      .addSelect('SUM("ProjectTasks"."value")', 'Project_valueSum')
      .addSelect('"ProjectPub"."uuid"', 'Project_uuid')
      .skip(skip)
      .limit(count)
      .orderBy(`Project.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .groupBy('Project.id')
      .addGroupBy('"ProjectPub"."uuid"')
      .getRawMany();

    console.log('selectOrderedProjects.rawArray', process.memoryUsage(), rawArray);
    const projects = this.rawToProject(rawArray);
    console.log('selectOrderedProjects.rawToProject', process.memoryUsage(), projects);
    return projects.map(project => {
      const rawArrayTimeSumElement = rawArrayTimeSum.find(el => el.id === project.id);
      project.timeSum = (rawArrayTimeSumElement && rawArrayTimeSumElement.timeSum) || 0;
      console.log('selectOrderedProjects.projects.map', {
        memory: process.memoryUsage(),
        projectId: project.id,
      });
      return project;
    });
  }

  private rawToProject(rawArray: any[]): Project[] {
    const res = rawArray.map((el: {}) => {
      const project = new Project();
      for (const field in el) {
        if (!el.hasOwnProperty(field)) {
          continue;
        }
        const arrField = field.split('_');
        if (arrField[1] === 'timeSum' || arrField[1] === 'valueSum') {
          project[arrField[1]] = parseInt(el[field], 0) || 0;
          continue;
        }
        project[arrField[1]] = el[field];
      }
      return project;
    });
    return res;
  }
}
