import { EntityRepository, Repository } from 'typeorm';

import { Project } from '../project/project.entity';
import { TaskCreateDto } from './dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  public findAllByProjectId(projectId: number): Promise<Task[]> {
    return this.find({ where: { project: { id: projectId } } });
  }

  public findOneByProjectId(id: number, projectId: number): Promise<Task> {
    return this.findOneOrFail({ where: { id, project: { id: projectId } } });
  }

  public createByProjectId(data: TaskCreateDto, projectId: number): Promise<Task> {
    const entity = this.create(data);
    entity.project = { id: projectId } as Project;
    return this.save(entity);
  }

  public async updateByProjectId(id: number, data: TaskCreateDto, projectId: number): Promise<Task> {
    let entity = await this.findOneOrFail(id);
    entity = this.merge(entity, data, { project: { id: projectId } });
    return this.save(entity);
  }
}
