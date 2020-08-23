import { EntityManager, EntityRepository, In, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto';
import { STATUS_NAME } from '../../@domains/strategy/types';
import { Project } from '../entities/project.entity';
import { Task } from '../entities/task.entity';
import { UserProject } from '../entities/user-project.entity';
import { User } from '../entities/user.entity';

export enum TaskOrderByField {
  'createdAt' = 'createdAt',
  'id' = 'id',
  'title' = 'title',
  'description' = 'description',
  'updatedAt' = 'updatedAt',
  'value' = 'value',
}

const requiredRelations = ['userTasks', 'projectParts'];

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public findAllByProjectId(
    { skip = 0, count = 20, orderBy = 'id', order = 'desc' }: PaginationDto,
    projectId: number,
    availableStatuses: STATUS_NAME[]
  ): Promise<[Task[], number]> {
    return this.createQueryBuilder('task')
      .addSelect('COUNT("task"."id")', 'sum')
      .orderBy({ [orderBy]: order.toUpperCase() as 'ASC' | 'DESC' })
      .groupBy('"task"."id"')
      .skip(skip)
      .take(count)
      .where('"task"."projectId" = :projectId', { projectId })
      .andWhere('"task"."isArchived" = :isArchived', { isArchived: false })
      .andWhere('"task"."statusTypeName" IN (:...availableStatuses)', { availableStatuses })
      .getManyAndCount();

    // return this.findAndCount({
    //   order: { [orderBy]: order.toUpperCase() },
    //   relations: requiredRelations,
    //   skip,
    //   take: count,
    //   where: { project: { id: projectId }, isArchived: false, statusTypeName: In(availableStatuses) },
    // });
  }

  public async findTasksWithPagination(
    { skip = 0, count = 50, orderBy = TaskOrderByField.updatedAt, order = 'desc' }: PaginationDto<TaskOrderByField>,
    user: User,
    userProjects: UserProject[] = []
  ): Promise<Task[]> {
    const projects = userProjects.map((el) => el.project).filter((project) => project.id !== user.defaultProjectId);
    let resTasks = [];
    for (const pr of projects) {
      const tasks = await this.find({
        order: {
          [orderBy]: order.toUpperCase(),
        },
        relations: requiredRelations,
        skip,
        take: count,
        where: {
          isArchived: false,
          performerId: user.id,
          projectId: pr.id,
          statusTypeName: In(pr.strategyInfo.canStartStatuses),
        },
      });
      resTasks = resTasks.concat(tasks);
    }

    return resTasks;
  }

  public async createByProject(data: Partial<Task>, project: Project, manager: EntityManager): Promise<Task> {
    const { max } = await manager
      .getRepository(Task)
      .createQueryBuilder()
      .select('MAX("sequenceNumber")', 'max')
      .where({
        project,
      })
      .getRawOne();
    const entity = manager.create(Task, data);
    entity.project = project;
    entity.sequenceNumber = (max || 0) + 1;
    return await manager.save(entity);
  }
}
