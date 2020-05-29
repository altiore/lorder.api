import { Column, Entity, ManyToOne } from 'typeorm';

import { TaskType } from '../../@orm/task-type/task-type.entity';
import { Project } from '../project/project.entity';

@Entity()
export class ProjectTaskType {
  @Column({ primary: true })
  projectId: number;

  @ManyToOne(type => Project, project => project.projectTaskTypes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    primary: true,
  })
  project: Project;

  @Column({ primary: true })
  taskTypeId: number;

  @ManyToOne(type => TaskType, taskType => taskType.projectTaskTypes, {
    eager: true,
    primary: true,
  })
  taskType: TaskType;

  @Column()
  order: number;
}
