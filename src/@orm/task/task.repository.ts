import { Between, EntityRepository, In, TreeRepository } from 'typeorm';

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
  ): Promise<Task[]> {
    return this.find({
      order: { [orderBy]: order.toUpperCase() },
      relations: ['users'],
      skip,
      take: count,
      where: { project: { id: projectId }, isArchived: false },
    });
  }

  public async findAllWithPagination(
    {
      skip = 0,
      count = 50,
      orderBy = TaskOrderByField.updatedAt,
      order = 'desc',
    }: PaginationDto<TaskOrderByField>,
    user: User,
    allowedProjectIds: number[] = []
  ): Promise<Task[]> {
    return this.find({
      order: {
        [orderBy]: order.toUpperCase(),
      },
      relations: ['users'],
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

  public findOneByOwner(id: number, ownerId: number): Promise<Task | undefined> {
    return this.createQueryBuilder()
      .where('Task.id=:id', {
        id,
      })
      .innerJoinAndSelect(
        'user_tasks',
        'UserTasks',
        '"UserTasks"."taskId"="Task"."id" AND "UserTasks"."userId"=:userId AND "Task"."isArchived"=:isArchived',
        { userId: ownerId, isArchived: false }
      )
      .getOne();
  }

  public findOneByProjectId(id: number, projectId: number): Promise<Task | undefined> {
    return this.findOne({ where: { id, project: { id: projectId } } });
  }

  public createByProject(data: Partial<Task>, project: Project): Task {
    const entity = this.create(data);
    entity.project = project;
    return entity;
  }
}
