import { EntityRepository, In, Repository } from 'typeorm';

import { Project } from '../project/project.entity';
import { TaskType } from '../task-type/task-type.entity';
import { ProjectTaskType } from './project-task-type.entity';

@EntityRepository(ProjectTaskType)
export class ProjectTaskTypeRepository extends Repository<ProjectTaskType> {
  public async createMultiple(project: Project, taskTypes: TaskType[]): Promise<any> {
    await this.delete({ project });
    const entities = taskTypes.map((taskType, order) =>
      this.create({
        order,
        project,
        taskType,
      })
    );
    await this.createQueryBuilder()
      .insert()
      .into(ProjectTaskType)
      .values(entities)
      .execute();
    return entities;
  }

  public async addToProject(project: Project, taskType: TaskType): Promise<ProjectTaskType> {
    const order = await this.count({ where: { project } });
    const entity = this.create({
      order,
      project,
      taskType,
    });
    return await this.save(entity);
  }

  public async removeFromProject(project: Project, taskType: TaskType): Promise<any> {
    const entities = await this.find({ where: { project }, order: { order: 'ASC' } });
    return this.createMultiple(project, entities.map(el => el.taskType).filter(el => el.id !== taskType.id));
  }
}
