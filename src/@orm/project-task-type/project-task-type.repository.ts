import { EntityRepository, Repository, In } from 'typeorm';

import { ProjectTaskType } from './project-task-type.entity';
import { Project } from '../project';
import { TaskType } from '../task-type';

@EntityRepository(ProjectTaskType)
export class ProjectTaskTypeRepository extends Repository<ProjectTaskType> {
  public async createMultiple(project: Project, taskTypes: TaskType[]): Promise<any> {
    await this.delete({ project });
    const entities = taskTypes.map((taskType, order) =>
      this.create({
        project,
        taskType,
        order,
      }),
    );
    await this.createQueryBuilder()
      .insert()
      .into(ProjectTaskType)
      .values(entities)
      .execute();
    return entities;
  }
}
