import { DeepPartial, EntityManager, EntityRepository, Repository } from 'typeorm';

import { ProjectTaskType } from '../entities/project-task-type.entity';
import { Project } from '../entities/project.entity';
import { TaskType } from '../entities/task-type.entity';

@EntityRepository(ProjectTaskType)
export class ProjectTaskTypeRepository extends Repository<ProjectTaskType> {
  public findAllByProject(project: DeepPartial<Project>): Promise<ProjectTaskType[]> {
    return this.find({
      order: { order: 'ASC' },
      where: { project },
    });
  }

  public async createMultiple(project: DeepPartial<Project>, taskTypes: TaskType[]): Promise<any> {
    await this.delete({ project: { id: project.id } });
    const entities = taskTypes.map((taskType, order) =>
      this.create({
        order,
        project,
        taskType,
      })
    );
    await this.createQueryBuilder().insert().into(ProjectTaskType).values(entities).execute();
    return entities;
  }

  public async addToProject(
    project: DeepPartial<Project>,
    taskType: TaskType,
    manager?: EntityManager
  ): Promise<ProjectTaskType> {
    const m = manager || this.manager;
    const order = await m.count(ProjectTaskType, { where: { project } });
    const entity = m.create(ProjectTaskType, {
      order,
      project,
      taskType,
    });
    return await m.save(entity);
  }

  public async removeFromProject(project: DeepPartial<Project>, taskType: TaskType): Promise<any> {
    const entities = await this.find({ where: { project }, order: { order: 'ASC' } });
    return this.createMultiple(
      project,
      entities.map((el) => el.taskType).filter((el) => el.id !== taskType.id)
    );
  }
}
