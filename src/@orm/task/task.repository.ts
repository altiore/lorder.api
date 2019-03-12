import { Between, EntityRepository, TreeRepository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Project } from '../project/project.entity';
import { ACCESS_LEVEL } from '../user-project';
import { UserWork } from '../user-work/user-work.entity';
import { User } from '../user/user.entity';
import { Task } from './task.entity';

export enum TaskOrderByField {
  'id' = 'id',
  'title' = 'title',
  'description' = 'description',
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
      relations: ['users', 'userWorks'],
      skip,
      take: count,
      where: { project: { id: projectId }, isArchived: false },
    });
  }

  public async findAllWithPagination(
    {
      skip = 0,
      count = 50, // TODO: сортировать по последнему изменению присвоенной задачи
      orderBy = TaskOrderByField.id,
      order = 'desc',
    }: PaginationDto<TaskOrderByField>,
    user: User
  ): Promise<Task[]> {
    const entities = await this.createQueryBuilder()
      .innerJoinAndSelect(
        'user_tasks',
        'UserTasks',
        '"UserTasks"."taskId"="Task"."id" AND "UserTasks"."userId"=:userId',
        { userId: user.id }
      )
      .innerJoin(
        'user_project',
        'UserProject',
        '"Task"."projectId"="UserProject"."projectId"' +
          ' AND "UserProject"."memberId"=:userId AND "UserProject"."accessLevel">:accessLevel',
        {
          accessLevel: ACCESS_LEVEL.WHITE,
          userId: user.id,
        }
      )
      // TODO:  используется для расчета продолжительности работы на фронте.
      // Возможно, стоит вернуть только результат такого расчета
      .leftJoinAndMapMany(
        'Task.userWorks',
        UserWork,
        'UserWork',
        '"UserWork"."userId"="UserTasks"."userId"' +
          ' AND "UserWork"."taskId"="Task"."id"' +
          ' AND "UserWork"."id" IN(' +
          'SELECT id from user_work where "taskId"="Task"."id"' +
          ' AND "userId"="UserTasks"."userId" ORDER BY "startAt" DESC' +
          ')'
      )
      .orderBy(`UserWork.startAt`, 'DESC', 'NULLS FIRST')
      .addOrderBy(`Task.${orderBy}`, order.toUpperCase() as 'ASC' | 'DESC')
      .take(count)
      .skip(skip)
      .where({
        isArchived: false,
        status: Between(1, 3),
      })
      .getMany();
    return entities;
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

  public createByProjectId(data: Partial<Task>, projectId: number): Promise<Task> {
    const entity = this.create(data);
    entity.project = { id: projectId } as Project;
    return this.save(entity);
  }

  public async updateByProjectId(id: number, data: Partial<Task>, projectId: number): Promise<Task> {
    let entity = await this.findOneOrFail(id);
    entity = this.merge(entity, data, { project: { id: projectId } });
    return this.save(entity);
  }
}
