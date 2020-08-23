import { Column, Entity, ManyToOne } from 'typeorm';

import { Project } from './project.entity';
import { TaskType } from './task-type.entity';

@Entity()
export class ProjectTaskType {
  @Column({ primary: true })
  projectId: number;

  @ManyToOne((type) => Project, (project) => project.projectTaskTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;

  @Column({ primary: true })
  taskTypeId: number;

  @ManyToOne((type) => TaskType, (taskType) => taskType.projectTaskTypes, {
    eager: true,
    primary: true,
  })
  taskType: TaskType;

  @Column()
  order: number;
}
