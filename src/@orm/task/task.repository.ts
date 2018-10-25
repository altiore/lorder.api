import { EntityRepository, Repository } from 'typeorm';

import { PaginationDto } from '../../@common/dto/pagination.dto';
import { Project } from '../project/project.entity';
import { UserWork } from '../user-work/user-work.entity';
import { User } from '../user/user.entity';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public findAllByProjectId(
    { skip = 0, count = 20, orderBy = 'id', order = 'desc' }: PaginationDto,
    projectId: number
  ): Promise<Task[]> {
    return this.find({
      loadRelationIds: true,
      order: { [orderBy]: order.toUpperCase() },
      relations: ['users'],
      skip,
      take: count,
      where: { project: { id: projectId } },
    });
  }

  public async findAllWithPagination(
    { skip = 0, count = 5, orderBy = 'latest', order = 'desc' }: PaginationDto<'latest' | 'oldest'>,
    user: User
  ): Promise<Task[]> {
    const entities = await this.createQueryBuilder()
      // .select(['id', 'title', 'description', ])
      .innerJoinAndSelect(
        'user_tasks',
        'UserTasks',
        '"UserTasks"."taskId"="Task"."id" AND "UserTasks"."userId"=:userId',
        { userId: user.id }
      )
      .leftJoinAndMapMany(
        'Task.userWorks',
        UserWork,
        'UserWork',
        '"UserWork"."userId"="UserTasks"."userId" AND "UserWork"."taskId"="Task"."id"'
      )
      // .leftJoinAndMapOne('Task.project', 'project', 'Project', '"Task"."projectId"="Project"."id"')
      .take(count)
      .skip(skip)
      .getMany();
    return entities.sort((a, b) => b.id - a.id);
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
