import { EntityRepository, Repository } from 'typeorm';

import { ProjectTaskType } from './project-task-type.entity';
import { Project } from '../project';
import { TaskType } from '../task-type';

@EntityRepository(ProjectTaskType)
export class ProjectTaskTypeRepository extends Repository<ProjectTaskType> {
  public createMultipleByProjectAndTaskTypes(project: Project, taskTypes: TaskType[]) {
    return this.createQueryBuilder()
      .insert()
      .values(taskTypes.map(taskType => ({
        projectId: project.id,
        projectId: project.id,
      })))
      .execute();
  }
}
