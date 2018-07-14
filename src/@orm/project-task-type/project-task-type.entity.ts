import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from '../project/project.entity';
import { TaskType } from '../task-type/task-type.entity';

@Entity()
export class ProjectTaskType {

  @ManyToOne(type => Project, project => project.projectTaskTypes, { primary: true })
  project: Project;

  @ManyToOne(type => TaskType, tasktype => tasktype.projectTaskTypes, { primary: true })
  taskType: TaskType;

  @Column()
  order: number;
}