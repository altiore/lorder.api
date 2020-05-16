import { Between, EntityManager, EntityRepository, In, TreeRepository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Project } from '../project/project.entity';
import { User } from '../user/user.entity';

import { Task } from './task.entity';

export enum TaskOrderByField {
  'createdAt' = 'createdAt',
  'id' = 'id',
  'title' = 'title',
  'description' = 'description',
  'updatedAt' = 'updatedAt',
  'value' = 'value',
}

@EntityRepository(Task)
export class TaskRepository extends TreeRepository<Task> {
  public findAllByProjectId(
    { skip = 0, count = 20, orderBy = 'id', order = 'desc' }: PaginationDto,
    projectId: number
  ): Promise<[Task[], number]> {
    return this.findAndCount({
      order: { [orderBy]: order.toUpperCase() },
      relations: ['userTasks'],
      skip,
      take: count,
      where: { project: { id: projectId }, isArchived: false },
    });
  }

  public async findAllWithPagination(
    { skip = 0, count = 50, orderBy = TaskOrderByField.updatedAt, order = 'desc' }: PaginationDto<TaskOrderByField>,
    user: User,
    allowedProjectIds: number[] = []
  ): Promise<Task[]> {
    return this.find({
      order: {
        [orderBy]: order.toUpperCase(),
      },
      relations: ['userTasks'],
      skip,
      take: count,
      where: {
        isArchived: false,
        performerId: user.id,
        projectId: In(allowedProjectIds),
        // TODO: заменить на статусы работы для этого пользователя
        status: Between(1, 3),
        userWorks: {
          userId: user.id,
        },
      },
    });
  }

  public findOneByProjectId(sequenceNumber: number, projectId: number): Promise<Task | undefined> {
    return this.findOne({ where: { sequenceNumber, project: { id: projectId } } });
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
